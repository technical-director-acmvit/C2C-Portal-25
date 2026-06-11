import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

if (!connectionString) {
  console.error("Missing database connection string");
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const rateLimitBuckets = new Map<string, RateLimitBucket>();

let schemaReady: Promise<void> | null = null;

function ensureSchema() {
  if (!schemaReady) {
    schemaReady = pool
      .query(
        `CREATE TABLE IF NOT EXISTS preregistrations (
           id           SERIAL PRIMARY KEY,
           name         TEXT NOT NULL,
           email        TEXT NOT NULL UNIQUE,
           created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
         );`,
      )
      .then(() => undefined)
      .catch((err) => {
        // Reset so a later request can retry the migration.
        schemaReady = null;
        throw err;
      });
  }
  return schemaReady;
}

function getClientIp(request: NextRequest) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  return forwardedIp || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(identifier: string) {
  const now = Date.now();

  for (const [key, bucket] of rateLimitBuckets) {
    if (bucket.resetAt <= now) {
      rateLimitBuckets.delete(key);
    }
  }

  const current = rateLimitBuckets.get(identifier);
  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(identifier, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { limited: false, retryAfter: 0 };
  }

  current.count += 1;
  if (current.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfter: Math.ceil((current.resetAt - now) / 1000),
    };
  }

  return { limited: false, retryAfter: 0 };
}

export async function POST(request: NextRequest) {
  try {
    const rateLimit = checkRateLimit(getClientIp(request));
    if (rateLimit.limited) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfter),
          },
        },
      );
    }

    const body = await request.json().catch(() => null);
    const name = typeof body?.name === "string" ? body.name.trim() : "";
    const emailRaw = typeof body?.email === "string" ? body.email.trim() : "";
    const email = emailRaw.toLowerCase();

    if (!name) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }
    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email." },
        { status: 400 },
      );
    }

    await ensureSchema();
    const client = await pool.connect();
    try {
      const existing = await client.query(`SELECT id FROM preregistrations WHERE email = $1`, [
        email,
      ]);
      if (existing.rows.length > 0) {
        return NextResponse.json(
          { success: false, alreadyRegistered: true, error: "You're already on the list." },
          { status: 409 },
        );
      }
      const result = await client.query(
        `INSERT INTO preregistrations (name, email)
         VALUES ($1, $2)
         RETURNING id`,
        [name, email],
      );
      return NextResponse.json({ success: true, id: result.rows[0].id });
    } finally {
      client.release();
    }
  } catch (error: unknown) {
    // Postgres unique violation — race between the SELECT and INSERT above.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "23505"
    ) {
      return NextResponse.json(
        { success: false, alreadyRegistered: true, error: "You're already on the list." },
        { status: 409 },
      );
    }
    console.error("preregister error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to register. Please try again." },
      { status: 500 },
    );
  }
}

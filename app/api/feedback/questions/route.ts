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

const DEFAULT_EVENT_TYPE = "C2C";

export async function GET(request: NextRequest) {
  try {
    const eventType = request.nextUrl.searchParams.get("event_type")?.trim() || DEFAULT_EVENT_TYPE;
    const client = await pool.connect();

    try {
      const result = await client.query(
        `SELECT id, question, position
         FROM feedback_questions
         WHERE event_type = $1
         ORDER BY position ASC`,
        [eventType],
      );

      return NextResponse.json({
        success: true,
        questions: result.rows,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error fetching feedback questions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch questions" },
      { status: 500 },
    );
  }
}

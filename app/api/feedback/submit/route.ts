import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || process.env.DB_URL;

if (!connectionString) {
  console.error('Missing database connection string');
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, answers, eventType = 'C2C' } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Answers are required' },
        { status: 400 }
      );
    }

    const client = await pool.connect();

    try {
      // Check if user already submitted feedback (only if email is provided)
      if (email) {
        const existingSubmission = await client.query(
          `SELECT id FROM feedback_submissions
           WHERE email = $1 AND event_type = $2`,
          [email, eventType]
        );

        if (existingSubmission.rows.length > 0) {
          return NextResponse.json(
            { success: false, error: 'Feedback already submitted for this email' },
            { status: 409 }
          );
        }
      }

      // Insert feedback submission (email can be null for anonymous submissions)
      const result = await client.query(
        `INSERT INTO feedback_submissions (email, event_type, answers, submitted_at)
         VALUES ($1, $2, $3, now())
         RETURNING id`,
        [email || null, eventType, JSON.stringify(answers)]
      );

      return NextResponse.json({
        success: true,
        submissionId: result.rows[0].id
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

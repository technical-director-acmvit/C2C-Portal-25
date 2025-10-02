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

export async function GET(request: NextRequest) {
  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(
        `SELECT id, question, position 
         FROM feedback_questions 
         WHERE event_type = 'C2C'
         ORDER BY position ASC`
      );

      return NextResponse.json({
        success: true,
        questions: result.rows
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching feedback questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}

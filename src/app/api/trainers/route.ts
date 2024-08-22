
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Trainer } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

export async function GET(req: NextRequest) {
  try {
    const result = await sql<Trainer>`SELECT trainer_id, fullname, email FROM trainers`;
    console.log("Trainers", result);

    if (!result || result.rows.length === 0) {
      return NextResponse.json({ message: 'No data returned from database' }, { status: 404 });
    }
    console.log('Full Query Result:', result.rows);

    const trainers = result.rows.map((row) => ({
      trainer_id: row.trainer_id ?? 0,
      fullname: row.fullname ?? 'Unknown',
      email: row.email ?? 'Unknown',
    }));

    return NextResponse.json(trainers);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching trainers:', error);
      return NextResponse.json({ message: `Failed to fetch trainers: ${error.message}` }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ message: 'Failed to fetch trainers: An unknown error occurred' }, { status: 500 });
    }
  }
}

  



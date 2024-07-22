import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Level } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

export default async function GET(req: NextRequest) {
  try {
    const data = await sql<Level>`
    SELECT level_id, level, description FROM levels;
    `;
    console.log('Levels query result:', data);

    if (!data || data.rows.length === 0) {
      return NextResponse.json({ message: 'No levels found' }, { status: 404 });
    }

    const levels = data.rows.map((row) => ({
        level_id : row.level_id ?? 0,
        level : row.level ?? 'Unknown',
        description : row.description ?? 'Unknown',
      }))

    return NextResponse.json(levels);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching levels:', error);
      return NextResponse.json({ message: `Failed to fetch levels: ${error.message}` }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ message: 'Failed to fetch levels: An unknown error occurred' }, { status: 500 });
    }
  }
}
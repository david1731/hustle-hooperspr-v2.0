import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Level } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

const fetchLevels = async () => {
  const result = await sql<Level>`SELECT level_id, level, description FROM levels`;
  console.log('fetchLevels result:', result);
  if (result.rows.length === 0) {
    throw new Error('No levels found');
  }
  return result.rows.map((row) => ({
    level_id: row.level_id ?? 0,
    level: row.level ?? 'Unknown',
    description: row.description ?? 'Unknown',
  }));
};

export async function GET(req: NextRequest) {
  try {
    const levels = await fetchLevels();
    console.log('API route levels:', levels);
    return NextResponse.json(levels);
  } catch (error) {
    if (error instanceof Error){
      console.error('Error fetching levels:', error);
      return NextResponse.json({ message: `Failed to fetch levels: ${error.message}` }, { status: 500 });
    }
    
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Trainer } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables once at the entry point
config();

// Function to fetch trainers from the database
const fetchTrainers = async (): Promise<Trainer[]> => {
  const result = await sql<Trainer>`SELECT trainer_id, fullname, email FROM trainers;`;
  
  if (!result || result.rows.length === 0) {
    console.warn('No trainers found');
    return []; // Return an empty array instead of throwing an error
  }
  
  console.log('Full Query Result:', result.rows);

  return result.rows.map((row) => ({
    trainer_id: row.trainer_id ?? 0,
    fullname: row.fullname ?? 'Unknown',
    email: row.email ?? 'Unknown',
  }));
}

// API Route Handler
export async function GET(req: NextRequest) {
  try {
    const trainers = await fetchTrainers();
    console.log("API route trainers:", trainers);
    
    const response = NextResponse.json(trainers);
    response.headers.set('Cache-Control', 'no-cache'); // You can use 'no-cache' for better performance
    return response;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching trainers:', error.message);
      return NextResponse.json({ message: `Failed to fetch trainers: ${error.message}` }, { status: 500 });
    }

    // Handle unexpected errors
    return NextResponse.json({ message: 'An unexpected error occurred' }, { status: 500 });
  }
}





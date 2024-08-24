
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Trainer } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

const fetchTrainers = async () =>{
  const result = await sql<Trainer>`SELECT trainer_id, fullname, email FROM trainers;`;
  if (!result || result.rows.length === 0) {
    throw new Error('No trainers found')
  }
  console.log('Full Query Result:', result.rows);

  return result.rows.map((row) => ({
    trainer_id: row.trainer_id ?? 0,
    fullname: row.fullname ?? 'Unknown',
    email: row.email ?? 'Unknown',
  }));
}

export async function GET(req:NextRequest){
  try{
    const trainers = await fetchTrainers();
    console.log("API route trainers:", trainers);
    return NextResponse.json(trainers);
  } catch(error){
    if (error instanceof Error){
      console.error('Error fetching trainers:', error);
      return NextResponse.json({ message: `Failed to fetch trainers: ${error.message}` }, { status: 500 });
    } 
  }
}



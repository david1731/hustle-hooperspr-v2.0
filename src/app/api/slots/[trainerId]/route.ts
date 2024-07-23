import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { TrainerSlots } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

const fetchSlotByTrainerID = async (trainerId: number) => {
  const result = await sql<TrainerSlots>`
    SELECT 
      tts.slot_id, 
      ts.start_time AS start_time, 
      ts.endtime, 
      tts.date 
    FROM 
      trainer_time_slots tts
    JOIN 
      time_slots ts ON tts.slot_id = ts.slot_id
    WHERE 
      tts.trainer_id = ${trainerId};
  `;
  console.log('fetchSlotByTrainerID result:', result);
  if (result.rows.length === 0) {
    throw new Error('No slots found');
  }
  return result.rows.map((row) => ({
    slot_id: row.slot_id ?? 0,
    start_time: row.start_time ?? 'Unknown',
    endtime: row.endtime ?? 'Unknown',
    date: row.date ?? 'Unknown',
  }));
};

export async function GET(req: NextRequest, { params }: { params: { trainerId: string } }) {
  const { trainerId } = params;
  console.log("TrainerId from slots/route.ts", trainerId);

  if (!trainerId) {
    console.log('trainerId path parameter is required');
    return NextResponse.json({ message: 'trainerId path parameter is required' }, { status: 400 });
  }

  const trainerIdNumber = parseInt(trainerId, 10);
  if (isNaN(trainerIdNumber)) {
    console.log('Invalid trainerId');
    return NextResponse.json({ message: 'Invalid trainerId' }, { status: 400 });
  }

  try {
    const slots = await fetchSlotByTrainerID(trainerIdNumber);
    console.log('API route slots:', slots);
    return NextResponse.json(slots);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching slots:', error);
      return NextResponse.json({ message: `Failed to fetch slots: ${error.message}` }, { status: 500 });
    }
  }
}



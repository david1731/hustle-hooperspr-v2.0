// app/api/trainers/[trainerId]/slots/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { TrainerSlots } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

export default async function GET(req: NextRequest, { params }: { params: { trainerId: string } }) {
  const { trainerId } = params;
  console.log("TrainerID", trainerId)
  try {
    const result = await sql<TrainerSlots>`SELECT slot_id, start_time, endtime, date FROM trainer_time_slots WHERE trainer_id = ${trainerId}`;
    console.log('TrainerSlots query result:', result);

    if (!result || result.rows.length === 0) {
      return NextResponse.json({ message: 'No slots found' }, { status: 404 });
    }

    const slots = result.rows.map((row) => ({
      slot_id: row.slot_id ?? 0,
      start_time: row.start_time ?? 'Unknown',
      endtime: row.endtime ?? 'Unknown',
      date: row.date ?? 'Unknown',
    }));

    return NextResponse.json(slots);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching slots:', error);
      return NextResponse.json({ message: `Failed to fetch slots: ${error.message}` }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ message: 'Failed to fetch slots: An unknown error occurred' }, { status: 500 });
    }
  }
}

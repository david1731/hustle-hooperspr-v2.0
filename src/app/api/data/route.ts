// src/app/api/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { TrainerSlots, Service, Level, Client } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

const fetchClientByEmail = async (email: string) => {
  const result = await sql<Client>`SELECT client_id FROM clients WHERE email = ${email}`;
  if (result.rows.length === 0) {
    throw new Error('Client not found');
  }
  return result.rows[0];
};

const fetchSlotByTrainerID = async (trainerId: string) => {
  const result = await sql<TrainerSlots>`
    SELECT slot_id, start_time, endtime, date 
    FROM trainer_time_slots 
    WHERE trainer_id = ${trainerId}
  `;
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

const fetchServices = async () => {
  const result = await sql<Service>`SELECT service_id, servicename, description FROM services`;
  if (result.rows.length === 0) {
    throw new Error('No services found');
  }
  return result.rows.map((row) => ({
    service_id: row.service_id ?? 0,
    servicename: row.servicename ?? 'Unknown',
    description: row.description ?? 'Unknown',
  }));
};

const fetchLevels = async () => {
  const result = await sql<Level>`SELECT level_id, level, description FROM levels`;
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
  const email = req.nextUrl.searchParams.get('email');
  const trainerId = req.nextUrl.searchParams.get('trainerId');

  if (!email || !trainerId) {
    return NextResponse.json({ message: 'Email and trainerId query parameters are required' }, { status: 400 });
  }

  try {
    const [client, slots, services, levels] = await Promise.all([
      fetchClientByEmail(email),
      fetchSlotByTrainerID(trainerId),
      fetchServices(),
      fetchLevels(),
    ]);

    return NextResponse.json({
      client,
      slots,
      services,
      levels,
    });
  } catch (error) {
    if (error instanceof Error) {
        console.error('Error fetching data:', error);
        return NextResponse.json({ message: `Failed to fetch data: ${error.message}` }, { status: 500 });
        }
    }
}

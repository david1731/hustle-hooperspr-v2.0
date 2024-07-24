// src/app/api/available-dates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { config } from 'dotenv';

config();

export async function GET() {
  try {
    const result = await sql`SELECT DISTINCT date FROM trainer_time_slots WHERE status = 'Available'`;
    const dates = result.rows.map((row) => row.date);
    return NextResponse.json(dates);
  } catch (error) {
    console.error('Error fetching available dates:', error);
    return NextResponse.json({ message: 'Failed to fetch available dates' }, { status: 500 });
  }
}

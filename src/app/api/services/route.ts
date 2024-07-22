// app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Service } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

export async function GET(req: NextRequest) {
  try {
    const result = await sql<Service>`SELECT service_id, servicename, description FROM services`;
    console.log('Services query result:', result);

    if (!result || result.rows.length === 0) {
      return NextResponse.json({ message: 'No services found' }, { status: 404 });
    }

    const services = result.rows.map((row) => ({
      service_id: row.service_id ?? 0,
      servicename: row.servicename ?? 'Unknown',
      description: row.description ?? 'Unknown',
    }));

    return NextResponse.json(services);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching services:', error);
      return NextResponse.json({ message: `Failed to fetch services: ${error.message}` }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ message: 'Failed to fetch services: An unknown error occurred' }, { status: 500 });
    }
  }
}

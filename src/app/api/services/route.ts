// src/app/api/services/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { Service } from '@/app/lib/definitions';
import { config } from 'dotenv';

// Load environment variables
config();

const fetchServices = async () => {
  const result = await sql<Service>`SELECT service_id, servicename, description FROM services`;
  console.log('fetchServices result:', result);
  if (result.rows.length === 0) {
    throw new Error('No services found');
  }
  return result.rows.map((row) => ({
    service_id: row.service_id ?? 0,
    servicename: row.servicename ?? 'Unknown',
    description: row.description ?? 'Unknown',
  }));
};

export async function GET(req: NextRequest) {
  try {
    const services = await fetchServices();
    console.log('API route services:', services);
    return NextResponse.json(services);
  } catch (error) {
    if (error instanceof Error){
      console.error('Error fetching services:', error);
      return NextResponse.json({ message: `Failed to fetch services: ${error.message}` }, { status: 500 });
    } 
  }
}

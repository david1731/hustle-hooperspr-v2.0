// app/api/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { config } from 'dotenv';
import { Client } from '@/app/lib/definitions';

// Load environment variables
config();

export default async function GET(req: NextRequest) {
  const email = req.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ message: 'Email query parameter is required' }, { status: 400 });
  }

  try {
    const result = await sql<Client[]>`SELECT client_id FROM clients WHERE email = ${email}`;
    console.log('Client query result:', result);
    
    if (!result || result.rows.length === 0) {
      return NextResponse.json({ message: 'Client not found' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching client:', error);
      return NextResponse.json({ message: `Failed to fetch client: ${error.message}` }, { status: 500 });
    } else {
      console.error('Unknown error:', error);
      return NextResponse.json({ message: 'Failed to fetch client: An unknown error occurred' }, { status: 500 });
    }
  }
}

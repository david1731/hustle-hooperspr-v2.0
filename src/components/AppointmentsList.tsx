
import React from 'react';
import { getUserAppointmentsByEmail } from '@/app/lib/data';
import { AppointmentQueryResult } from '@/app/lib/definitions';
import ClientAppointmentsList from './ClientAppointmentList';

export default async function AppointmentsList({ email }: { email: string }) {
  let appointments: AppointmentQueryResult[] = []; //array that will contain the query results must be of type AppointmentQueryResult(defined in definitions.ts)
  
  try {
    appointments = await getUserAppointmentsByEmail(email); //fetch the user's appointments given their email
  } catch (error) { //handle errors
    console.error('Error fetching appointments:', error);
  }

  return <ClientAppointmentsList appointments={appointments} />; //render the ClientAppointmentList component passing the query results as props
}

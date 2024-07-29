
import React from 'react';
import { getUserAppointmentsByEmail } from '@/app/lib/data';
import { AppointmentQueryResult } from '@/app/lib/definitions';
import ClientAppointmentsList from './ClientAppointmentList';

export default async function AppointmentsList({ email }: { email: string }) {
  let appointments: AppointmentQueryResult[] = [];

  try {
    appointments = await getUserAppointmentsByEmail(email);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }

  return <ClientAppointmentsList appointments={appointments} />;
}

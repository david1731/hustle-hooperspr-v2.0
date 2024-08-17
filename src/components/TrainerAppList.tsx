import React from 'react';
import { trainerAppointments } from '@/app/lib/data';
import { AppointmentQueryResult } from '@/app/lib/definitions';
import TrainerAppointmentsList from './TrainerAppointments';

export default async function AppointmentsList({ trainer_id }: { trainer_id: number}) {
  let appointments: AppointmentQueryResult[] = [];

  try {
    console.log("trainer_id from TraineAppList", trainer_id);
    appointments = await trainerAppointments(trainer_id);
    console.log("Appointments in AppointmentsList:", appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }

  return <TrainerAppointmentsList appointments={appointments} />;
}
import React from 'react';
import { getUserAppointmentsByEmail } from '@/app/lib/data';
import { AppointmentQueryResult } from '@/app/lib/definitions';

export default async function AppointmentsList({ email }: { email: string }) {
  let appointments: AppointmentQueryResult[] = [];

  try {
    appointments = await getUserAppointmentsByEmail(email);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }
  console.log("Appointments:", appointments);
  return (
    <div>
      <h1>Your Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <ul>
          {appointments.map(appointment => (
            <li key={appointment.app_id}>
              <p>Trainer: {appointment.trainer_name} {appointment.trainer_lastname}</p>
              <p>Service: {appointment.service}</p>
              <p>Level: {appointment.level}</p>
              <p>Start Time: {appointment.starttime}</p>
              <p>End Time: {appointment.endtime}</p>
              <p>Date: {appointment.appointment_date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

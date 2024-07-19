import React, { useEffect, useState } from 'react';
import { getUserAppointmentsByEmail } from '@/app/lib/data';
import { AppointmentQueryResult } from '@/app/lib/definitions';

export default async function AppointmentsList({ email }: { email: string }) {
  const appointments = await getUserAppointmentsByEmail(email);

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
              <p>Service: {appointment.servicename}</p>
              <p>Level: {appointment.level}</p>
              <p>Start Time: {appointment.starttime}</p>
              <p>End Time: {appointment.endtime}</p>
              <p>Date: {appointment.date}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

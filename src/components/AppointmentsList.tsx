'use client';
import React, { useEffect, useState } from 'react';
import { getUserAppointmentsByEmail } from '@/app/lib/data';
import { AppointmentQueryResult } from '@/app/lib/definitions';

export default function AppointmentsList({ email }: { email: string }) {
  const [appointments, setAppointments] = useState<AppointmentQueryResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Component mounted or email changed:', email);
    const fetchAppointments = async () => {
      try {
        const data = await getUserAppointmentsByEmail(email);
        console.log('Fetched Appointments:', data); 
        setAppointments(data);
      } catch (error) {
        console.error('Failed to fetch appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [email]);

  if (loading) {
    return <p>Loading...</p>;
  }

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

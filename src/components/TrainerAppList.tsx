'use client';

import React, { useEffect, useState } from 'react';
import { AppointmentQueryResult } from '@/app/lib/definitions';
import TrainerAppointmentsList from './TrainerAppointments';
import { trainerAppointments } from '@/app/lib/data';

interface AppointmentsListProps {
  trainer_id: number;
}

const AppointmentsList: React.FC<AppointmentsListProps> = ({ trainer_id }) => {
  const [appointments, setAppointments] = useState<AppointmentQueryResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        console.log("Fetching appointments for trainer_id:", trainer_id);
        const result = await trainerAppointments(trainer_id);
        console.log("Fetched appointments:", result);
        setAppointments(result);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        setError('Failed to load appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [trainer_id]); // Dependencies array

  if (loading) {
    return <p>Loading appointments...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return <TrainerAppointmentsList appointments={appointments} />;
};

export default AppointmentsList;

'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { AppointmentQueryResult, TrainerSlots } from '@/app/lib/definitions';
import { fetchAvailableTrainerSlots } from '@/app/lib/data'; // Ensure this function is imported

interface AppointmentsListProps {
  appointments: AppointmentQueryResult[];
  trainerId: number; // Ensure trainerId is passed as a prop
}

const TrainerAppointmentsList: React.FC<AppointmentsListProps> = ({ appointments, trainerId }) => {
  const [availableSlots, setAvailableSlots] = useState<TrainerSlots[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const slots = await fetchAvailableTrainerSlots(trainerId);
        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching available slots:', error);
        setError('Failed to load available slots.');
      }
    };

    fetchSlots();
  }, [trainerId]);

  return (
    <div className="mt-5">
      <h1 className="mb-4 text-4xl antialiased">Tus Citas</h1>
      {appointments.length === 0 ? (
        <p>No tienes citas.</p>
      ) : (
        <div className="flex flex-wrap justify-start">
          {appointments.map(appointment => (
            <div key={appointment.app_id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <div className="card bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="card-body">
                  <h5 className="card-title">Cliente: {appointment.client_name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Servicio: {appointment.service}</h6>
                  <p className="card-text">
                    <strong>Nivel:</strong> {appointment.level}<br />
                    <strong>Hora:</strong> {appointment.starttime} - {appointment.endtime}<br />
                    <strong>Fecha:</strong> {appointment.appointment_date}
                  </p>
                  <Button type="button" className="btn bg-red-700 text-white mt-2 rounded hover:bg-red-600" >Cancelar Cita</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="mt-8 mb-4 text-3xl antialiased">Fechas y Horas Disponibles</h2>
      {error && <p className="text-red-500">{error}</p>}
      {availableSlots.length === 0 ? (
        <p>No tienes fechas y horas disponibles.</p>
      ) : (
        <div className="flex flex-wrap justify-start">
          {availableSlots.map((slot, index) => (
            <div key={index} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
              <div className="card bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="card-body">
                  <h5 className="card-title">Fecha: {slot.date}</h5>
                  <p className="card-text">
                    <strong>Hora:</strong> {slot.starttime} - {slot.endtime}
                  </p>
                  <Button type="button" className="btn bg-red-700 text-white mt-2 rounded hover:bg-red-600" >Eliminar Hora</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrainerAppointmentsList;



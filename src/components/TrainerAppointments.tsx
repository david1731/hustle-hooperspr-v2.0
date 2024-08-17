'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { AppointmentQueryResult } from '@/app/lib/definitions';

interface AppointmentsListProps {
  appointments: AppointmentQueryResult[];
}

const TrainerAppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  
  return (
    <div className="mt-5">
      <h1 className="mb-4 text-4xl antialiased">Your Trainer Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
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

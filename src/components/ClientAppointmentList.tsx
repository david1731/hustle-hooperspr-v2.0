'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { AppointmentQueryResult } from '@/app/lib/definitions';
import { fetchDeleteUpdateApp } from '@/app/lib/data';

interface AppointmentsListProps {
  appointments: AppointmentQueryResult[];
}

const ClientAppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
    const router = useRouter();
  const handleCancel = async (app_id: number) => {
    try {
      await fetchDeleteUpdateApp(app_id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Your Appointments</h1>
      {appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <div className="row">
          {appointments.map(appointment => (
            <div key={appointment.app_id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Entrenador: {appointment.trainer_fullname}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Servicio: {appointment.service}</h6>
                  <p className="card-text">
                    <strong>Level:</strong> {appointment.level}<br />
                    <strong>Hora:</strong> {appointment.starttime} - {appointment.endtime}<br />
                    <strong>Fecha:</strong> {appointment.appointment_date}
                  </p>
                  <Button type="button" className="btn btn-danger" onClick={() => handleCancel(appointment.app_id)}>Cancelar Cita</Button>
                  <Button type="button" className="btn btn-success ml-2" onClick={() => router.push(`/dashboard/citas/${appointment.app_id}`)}>Editar Cita</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientAppointmentsList;

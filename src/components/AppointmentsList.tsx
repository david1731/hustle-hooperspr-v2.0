'use client';
import React from 'react';
import { getUserAppointmentsByEmail, cancelAppointment, fetchInfoFromAppointments, changeStatus } from '@/app/lib/data';
import { AppointmentQueryResult, InfoFromAppointments } from '@/app/lib/definitions';

export default async function AppointmentsList({ email }: { email: string }) {
  let appointments: AppointmentQueryResult[] = [];

  try {
    appointments = await getUserAppointmentsByEmail(email);
  } catch (error) {
    console.error('Error fetching appointments:', error);
  }

  const handleCancel = (app_id: number) =>{
    try{
      cancelAppointment(app_id);
      //Fetch data and update status in one function in data.ts
      window.location.reload();
    } catch(error){
      console.error("Error deleting appointment");
    }
  }

  // console.log("Appointments:", appointments);
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
                  <button type="button" className="btn btn-danger" onClick={() => handleCancel(appointment.app_id)}>Cancelar Cita</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


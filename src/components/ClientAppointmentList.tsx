'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'react-bootstrap';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AppointmentQueryResult } from '@/app/lib/definitions';
import { fetchDeleteUpdateApp } from '@/app/lib/data';

interface AppointmentsListProps {
  appointments: AppointmentQueryResult[]; //props passed from parent componentt
}

const ClientAppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  const router = useRouter(); //router component for redirection
  const handleCancel = async (app_id: number) => { //action to cancel appointments
    try {
      await fetchDeleteUpdateApp(app_id); //calls function from data.ts that deletes an appointment from the database given the app_id
      window.location.reload(); //reload the current page to see the changes in the user's appointments instantly
    } catch (error) { //handle errors
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="mt-5">
      <h1 className="mb-4 text-4xl antialiased">Tus Citas</h1>
      {appointments.length === 0 ? (
        <p>No tienes citas pendientes.</p>
      ) : (
        // Swiper component 
        //Displays the user's appointments as a caroussel in smaller screens
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{ clickable: true }}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="flex flex-wrap justify-start"
        >
          {/* Display appointments from appointment array that contains the result from the query */}
          {appointments.map(appointment => (
            <SwiperSlide key={appointment.app_id} className="p-2">
              <div className="card bg-white shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="card-body">
                  <h5 className="card-title">Entrenador: {appointment.trainer_fullname}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">Servicio: {appointment.service}</h6>
                  <p className="card-text">
                    <strong>Level:</strong> {appointment.level}<br />
                    <strong>Hora:</strong> {appointment.starttime} - {appointment.endtime}<br />
                    <strong>Fecha:</strong> {appointment.appointment_date}
                  </p>
                  <Button type="button" className="btn bg-red-700 text-white mt-2 rounded hover:bg-red-600" onClick={() => handleCancel(appointment.app_id)}>Cancelar Cita</Button>
                  <Button type='button' className='btn bg-green-700 text-white ml-2 mt-2 rounded hover:bg-green-600' onClick={() => router.push(`/dashboard/citas/${appointment.app_id}`)}>Editar Cita</Button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ClientAppointmentsList;


'use client';
import { config } from 'dotenv';
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { TrainerSlots, Service, Level } from '@/app/lib/definitions';
import { updateTimeSlotStatus, createAppointment, fetchSlots, fetchAvailableDates } from '@/app/lib/data';
import CheckoutForm from '@/components/CheckoutForm';

config();

export default function TrainerDetailPage() {
  const searchParams = useSearchParams();
  const { trainerId } = useParams();
  const useremail = searchParams.get('email');

  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<TrainerSlots[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);

  useEffect(() => {
    async function fetchLevels() {
      try {
        const response = await fetch(`/api/levels`);
        if (!response.ok) {
          throw new Error('Failed to fetch levels');
        }
        const data = await response.json();
        setLevels(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching levels:', error);
          setError(error.message);
        }
      }
    }

    async function fetchServices() {
      try {
        const response = await fetch(`/api/services`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching services:', error);
          setError(error.message);
        }
      }
    }

    fetchLevels();
    fetchServices();
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    console.log('Selected date:', selectedDate);
  };

  const handleSlotDropdownClick = async () => {
    try {
      if (!selectedDate || !trainerId) return;
      const parsedTrainerId = Array.isArray(trainerId) ? trainerId[0] : trainerId;
      const slotsData = await fetchSlots(parseInt(parsedTrainerId), selectedDate);
      setSlots(slotsData);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching available time slots:', error);
        setError(error.message);
      }
    }
  };

  const handleDateDropdown = async () => {
    try {
      if (!trainerId) return;
      const parsedTrainerId = Array.isArray(trainerId) ? trainerId[0] : trainerId;
      const datesData = await fetchAvailableDates(parseInt(parsedTrainerId));
      setDates(datesData || []);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching available time slots:', error);
        setError(error.message);
      }
    }
  }

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotId = Number(e.target.value);
    setSelectedSlot(slotId);
    console.log('Selected slot_id:', slotId);
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = Number(e.target.value);
    setSelectedLevel(levelId);
    console.log('Selected level_id:', levelId);
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = Number(e.target.value);
    setSelectedService(serviceId);
    console.log('Selected service_id:', serviceId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlot && selectedLevel && selectedService && selectedDate && useremail) {
      try {
        const parsedTrainerId = Array.isArray(trainerId) ? trainerId[0] : trainerId;
        const result = await createAppointment(
          selectedSlot,
          useremail,
          selectedLevel,
          parseInt(parsedTrainerId, 10),
          selectedService,
          selectedDate
        );

         await updateTimeSlotStatus(
          selectedSlot,
          parseInt(parsedTrainerId, 10),
          selectedDate,
          'Unavailable'
        );

        console.log('Appointment created:', result);
        alert('Appointment created successfully');
        window.location.reload();
      } catch (error) {
        console.error('Error creating appointment:', error);
        alert('Failed to create appointment');
      }
    } else {
      alert('Please select all fields');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fechas Disponibles</h1>
      {error && <div className="bg-red-500 text-white p-2 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-3">
          <label htmlFor="dates" className="block text-sm font-medium text-gray-700">Fecha</label>
          <select
            id="dates"
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleDateDropdown}
            onChange={handleDateChange}
            value={selectedDate}
          >
            <option value="" disabled>Seleccione una fecha</option>
            {dates.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="slots" className="block text-sm font-medium text-gray-700">Horas Disponible</label>
          <select
            id="slots"
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSlotDropdownClick}
            onChange={handleSlotChange}
            value={selectedSlot ?? ''}
          >
            <option value="" disabled>Seleccione una hora</option>
            {slots.map((slot) => (
              <option key={slot.slot_id} value={slot.slot_id}>
                {slot.starttime} - {slot.endtime} {slot.date}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="levels" className="block text-sm font-medium text-gray-700">Nivel</label>
          <select
            id="levels"
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleLevelChange}
            value={selectedLevel ?? ''}
          >
            <option value="" disabled>Seleccione su nivel de experiencia</option>
            {levels.map((level) => (
              <option key={level.level_id} value={level.level_id}>
                {level.level}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="services" className="block text-sm font-medium text-gray-700">Servicios</label>
          <select
            id="services"
            className="block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleServiceChange}
            value={selectedService ?? ''}
          >
            <option value="" disabled>Seleccione un servicio</option>
            {services.map((service) => (
              <option key={service.service_id} value={service.service_id}>
                {service.servicename}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200">
          Reservar Cita
        </button>
        <CheckoutForm/>
      </form>
    </div>
  );
}




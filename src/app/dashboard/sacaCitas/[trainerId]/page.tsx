'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { TrainerSlots, Service, Level } from '@/app/lib/definitions';
import { createAppointment } from '@/app/lib/data';

const TrainerDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trainerId = searchParams.get('trainerId');
  const email = searchParams.get('email');

  const [slots, setSlots] = useState<TrainerSlots[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>('');
  const [clientId, setClientId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchClientId() {
      try {
        const response = await fetch(`/api/clients?email=${email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch client');
        }
        const clientData = await response.json();
        console.log('Client ID:', clientData.client_id);
        alert(`Client ID fetched: ${clientData.client_id}`)
        setClientId(clientData.client_id);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching slots:', error);
          setError(error.message);
        } else {
          console.error('Unknown error:', error);
          setError('An unknown error occurred');
        }
      }
    }

    async function loadSlots() {
      try {
        const response = await fetch(`/api/trainers/${trainerId}/slots`);
        if (!response.ok) {
          throw new Error('Failed to fetch slots');
        }
        const slotsData = await response.json();
        console.log('Slots data:', slotsData);
        alert(`Slots data fetched: ${JSON.stringify(slotsData)}`);
        setSlots(slotsData);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching slots:', error);
          setError(error.message);
        } else {
          console.error('Unknown error:', error);
          setError('An unknown error occurred');
        }
      }
    }

    async function loadServices() {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const servicesData = await response.json();
        console.log('Services data:', servicesData);
        alert(`Services data fetched: ${JSON.stringify(servicesData)}`);
        setServices(servicesData);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching services:', error);
          setError(error.message);
        } else {
          console.error('Unknown error:', error);
          setError('An unknown error occurred');
        }
      }
    }

    async function loadLevels() {
      try {
        const response = await fetch('/api/levels');
        if (!response.ok) {
          throw new Error('Failed to fetch levels');
        }
        const levelsData = await response.json();
        console.log('Levels data:', levelsData);
        alert(`Levels data fetched: ${JSON.stringify(levelsData)}`);
        setLevels(levelsData);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching levels:', error);
          setError(error.message);
        } else {
          console.error('Unknown error:', error);
          setError('An unknown error occurred');
        }
      }
    }

    if (trainerId && email) {
      fetchClientId();
      loadSlots();
      loadServices();
      loadLevels();
    }
  }, [trainerId, email]);

  const handleCreateAppointment = async () => {
    if (selectedSlot && selectedService && selectedLevel && clientId && appointmentDate) {
      try {
        await createAppointment(
          selectedSlot,
          clientId,
          selectedLevel,
          Number(trainerId),
          selectedService,
          appointmentDate
        );
        alert('Appointment created successfully');
      } catch (error) {
        console.error('Error creating appointment:', error);
        alert('Failed to create appointment');
      }
    } else {
      alert('Please select all required fields');
    }
  };

  return (
    <div>
      <h1>Available Slots, Services, and Levels</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <h2>Available Slots</h2>
      <select onChange={(e) => setSelectedSlot(Number(e.target.value))} value={selectedSlot ?? ''}>
        <option value="" disabled>Select a slot</option>
        {slots.map((slot) => (
          <option key={slot.slot_id} value={slot.slot_id}>
            {slot.start_time} - {slot.endtime}
          </option>
        ))}
      </select>
      <h2>Available Services</h2>
      <select onChange={(e) => setSelectedService(Number(e.target.value))} value={selectedService ?? ''}>
        <option value="" disabled>Select a service</option>
        {services.map((service) => (
          <option key={service.service_id} value={service.service_id}>
            {service.servicename}
          </option>
        ))}
      </select>
      <h2>Available Levels</h2>
      <select onChange={(e) => setSelectedLevel(Number(e.target.value))} value={selectedLevel ?? ''}>
        <option value="" disabled>Select a level</option>
        {levels.map((level) => (
          <option key={level.level_id} value={level.level_id}>
            {level.level}
          </option>
        ))}
      </select>
      <h2>Appointment Date</h2>
      <input 
        type="date" 
        value={appointmentDate} 
        onChange={(e) => setAppointmentDate(e.target.value)} 
      />
      <button onClick={handleCreateAppointment}>Create Appointment</button>
    </div>
  );
};

export default TrainerDetailPage;

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
    async function fetchData() {
      try {
        const response = await fetch(`/api/data?email=${email}&trainerId=${trainerId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log('Fetched data:', data);
        alert(`Fetched data: ${JSON.stringify(data)}`);
        
        setClientId(data.client.client_id);
        setSlots(data.slots);
        setServices(data.services);
        setLevels(data.levels);
      } catch (error) {
        if (error instanceof Error){
          console.error('Error fetching data:', error);
        alert(`Error fetching data: ${error.message}`);
        setError(error.message);
        }     
      }
    }

    if (trainerId && email) {
      fetchData();
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
      {slots.length === 0 && !error && <p>Loading slots...</p>}
      <select onChange={(e) => setSelectedSlot(Number(e.target.value))} value={selectedSlot ?? ''}>
        <option value="" disabled>Select a slot</option>
        {slots.map((slot) => (
          <option key={slot.slot_id} value={slot.slot_id}>
            {slot.start_time} - {slot.endtime} on {slot.date}
          </option>
        ))}
      </select>
      <h2>Available Services</h2>
      {services.length === 0 && !error && <p>Loading services...</p>}
      <select onChange={(e) => setSelectedService(Number(e.target.value))} value={selectedService ?? ''}>
        <option value="" disabled>Select a service</option>
        {services.map((service) => (
          <option key={service.service_id} value={service.service_id}>
            {service.servicename}
          </option>
        ))}
      </select>
      <h2>Available Levels</h2>
      {levels.length === 0 && !error && <p>Loading levels...</p>}
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


// src/app/dashboard/sacaCitas/[trainerId]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fetchSlotByTrainerID, createAppointment, fetchClientByEmail } from '@/app/lib/data';
import { TrainerSlots, Service, Level } from '@/app/lib/definitions';
import { useSession } from '@/app/context/SessionContext';

const TrainerDetailPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const trainerId = searchParams.get('trainerId');
  const email = searchParams.get('email');
  const user = useSession();

  const [slots, setSlots] = useState<TrainerSlots[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [clientId, setClientId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const slotsData = await fetchSlotByTrainerID(Number(trainerId));
        setSlots(slotsData);

        // Assuming you have similar functions to fetch services and levels
        // const servicesData = await fetchServices();
        // setServices(servicesData);
        // const levelsData = await fetchLevels();
        // setLevels(levelsData);

        if (email) {
          const clientData = await fetchClientByEmail(email as string);
          setClientId(clientData.client_id);
        }
      } catch (error) {
        console.error('Error fetching details', error);
      }
    }

    if (trainerId && email) {
      fetchDetails();
    }
  }, [trainerId, email]);

  const handleCreateAppointment = async () => {
    if (selectedSlot !== null && selectedService !== null && selectedLevel !== null && clientId !== null) {
      try {
        await createAppointment(selectedSlot, clientId, selectedLevel, Number(trainerId), selectedService, appointmentDate);
        alert('Appointment created successfully');
      } catch (error) {
        console.error('Error creating appointment', error);
        alert('Failed to create appointment');
      }
    } else {
      alert('Please select all required fields');
    }
  };

  return (
    <div>
      <h1>Choose Time, Service, and Level</h1>
      <div>
        <label htmlFor="timeSlot">Time Slot</label>
        <select id="timeSlot" onChange={(e) => setSelectedSlot(Number(e.target.value))}>
          <option value="">Select a time slot</option>
          {slots.map((slot) => (
            <option key={slot.slot_id} value={slot.slot_id}>
              {slot.start_time} - {slot.endtime} on {slot.date}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="service">Service</label>
        <select id="service" onChange={(e) => setSelectedService(Number(e.target.value))}>
          <option value="">Select a service</option>
          {services.map((service) => (
            <option key={service.service_id} value={service.service_id}>
              {service.servicename}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="level">Level</label>
        <select id="level" onChange={(e) => setSelectedLevel(Number(e.target.value))}>
          <option value="">Select a level</option>
          {levels.map((level) => (
            <option key={level.level_id} value={level.level_id}>
              {level.level}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="date">Date</label>
        <input 
          type="date" 
          id="date" 
          value={appointmentDate} 
          onChange={(e) => setAppointmentDate(e.target.value)} 
          required
        />
      </div>
      <button onClick={handleCreateAppointment}>Create Appointment</button>
    </div>
  );
};

export default TrainerDetailPage;



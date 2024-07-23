'use client';
import { config } from 'dotenv';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { TrainerSlots, Service, Level } from '@/app/lib/definitions';
import { createAppointment } from '@/app/lib/data';

config();
export default function TrainerDetailPage() {
  const searchParams = useSearchParams();
  const { trainerId } = useParams();
  const useremail = searchParams.get('email');
  // console.log("User email:" ,useremail);
  // console.log("User id:" ,trainerId);

  const [slots, setSlots] = useState<TrainerSlots[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [appointmentDate, setAppointmentDate] = useState<string>('');

  useEffect(() => {
    async function fetchSlots() {
      console.log("TrainerId:", trainerId);
      try {
        if (!trainerId && !useremail) {
          throw new Error('trainerId is required');
        }

        const response = await fetch(`/api/slots/${trainerId}`);
        console.log('Fetch slots response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch slots');
        }
        const data = await response.json();
        console.log('Fetched slots:', data);
        setSlots(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching slots:', error);
          setError(error.message);
        }
      }
    }

    async function fetchLevels() {
      try {
        const response = await fetch(`/api/levels`);
        console.log('Fetch levels response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch levels');
        }
        const data = await response.json();
        console.log('Fetched levels:', data);
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
        console.log('Fetch services response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        console.log('Fetched services:', data);
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
    fetchSlots();
  }, [trainerId]);

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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppointmentDate(e.target.value);
    console.log('Selected appointment date:', e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlot && selectedLevel && selectedService && appointmentDate && useremail) {
      try {
        const parsedTrainerId = Array.isArray(trainerId) ? trainerId[0] : trainerId;
        const result = await createAppointment(
          selectedSlot,
          useremail,
          selectedLevel,
          parseInt(parsedTrainerId),
          selectedService,
          appointmentDate.toString()
        );
        console.log('Appointment created:', result);
        alert('Appointment created successfully');
      } catch (error) {
        console.error('Error creating appointment:', error);
        alert('Failed to create appointment');
      }
    } else {
      alert('Please select all fields');
    }
  };

  return (
    <div>
      <h1>Available Slots, Services, and Levels</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="slots">Select a Slot</label>
          <select id="slots" onChange={handleSlotChange} value={selectedSlot ?? ''}>
            <option value="" disabled>Select a slot</option>
            {slots.map((slot) => (
              <option key={slot.slot_id} value={slot.slot_id}>
                {slot.start_time} - {slot.endtime} on {slot.date}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="levels">Select a Level</label>
          <select id="levels" onChange={handleLevelChange} value={selectedLevel ?? ''}>
            <option value="" disabled>Select a level</option>
            {levels.map((level) => (
              <option key={level.level_id} value={level.level_id}>
                {level.level}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="services">Select a Service</label>
          <select id="services" onChange={handleServiceChange} value={selectedService ?? ''}>
            <option value="" disabled>Select a service</option>
            {services.map((service) => (
              <option key={service.service_id} value={service.service_id}>
                {service.servicename}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="appointmentDate">Select Appointment Date</label>
          <input type="text" id="appointmentDate" value={appointmentDate} onChange={handleDateChange} />
        </div>
        <button type="submit">Create Appointment</button>
      </form>
    </div>
  );
};



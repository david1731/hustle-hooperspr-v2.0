'use client';
import { config } from 'dotenv';
import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { TrainerSlots, Service, Level } from '@/app/lib/definitions';
import { updateTimeSlotStatus, createAppointment } from '@/app/lib/data';

config();

export default function TrainerDetailPage() {
  const searchParams = useSearchParams();
  const { trainerId } = useParams();
  const useremail = searchParams.get('email');
  console.log("User email:", useremail);
  console.log("Trainer ID:", trainerId);

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
    async function fetchDates() {
      try {
        const response = await fetch('/api/availableDates');
        if (!response.ok) {
          throw new Error('Failed to fetch available dates');
        }
        const data = await response.json();
        setDates(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching available dates:', error);
          setError(error.message);
        }
      }
    }

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

    fetchDates();
    fetchLevels();
    fetchServices();
  }, []);

  useEffect(() => {
    async function fetchSlots() {
      try {
        if (!selectedDate || !trainerId) return;

        const response = await fetch(`/api/slots/${trainerId}/${selectedDate}`);
        if (!response.ok) {
          throw new Error('Failed to fetch available time slots');
        }
        const data = await response.json();
        setSlots(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching available time slots:', error);
          setError(error.message);
        }
      }
    }

    fetchSlots();
  }, [selectedDate, trainerId]);

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
    console.log('Selected date:', e.target.value);
  };

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
      } catch (error) {
        console.error('Error creating appointment:', error);
        alert('Failed to create appointment');
      }
    } else {
      alert('Please select all fields');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Available Slots, Services, and Levels</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="dates" className="form-label">Select a Date</label>
          <select
            id="dates"
            className="form-select"
            onChange={handleDateChange}
            value={selectedDate}
          >
            <option value="" disabled>Select a date</option>
            {dates.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="slots" className="form-label">Select a Slot</label>
          <select
            id="slots"
            className="form-select"
            onChange={handleSlotChange}
            value={selectedSlot ?? ''}
          >
            <option value="" disabled>Select a slot</option>
            {slots.map((slot) => (
              <option key={slot.slot_id} value={slot.slot_id}>
                {slot.start_time} - {slot.endtime} on {slot.date}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="levels" className="form-label">Select a Level</label>
          <select
            id="levels"
            className="form-select"
            onChange={handleLevelChange}
            value={selectedLevel ?? ''}
          >
            <option value="" disabled>Select a level</option>
            {levels.map((level) => (
              <option key={level.level_id} value={level.level_id}>
                {level.level}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="services" className="form-label">Select a Service</label>
          <select
            id="services"
            className="form-select"
            onChange={handleServiceChange}
            value={selectedService ?? ''}
          >
            <option value="" disabled>Select a service</option>
            {services.map((service) => (
              <option key={service.service_id} value={service.service_id}>
                {service.servicename}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Create Appointment</button>
      </form>
    </div>
  );
}

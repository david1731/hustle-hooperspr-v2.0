'use client';

// Import necessary modules and functions
import { config } from 'dotenv'; // To load environment variables
import React, { useState, useEffect } from 'react'; // React hooks
import { useParams, useSearchParams } from 'next/navigation'; // Hooks for accessing route parameters and query strings
import { TrainerSlots, Service, Level } from '@/app/lib/definitions'; // Importing types and definitions
import { fetchSlots, fetchAvailableDates } from '@/app/lib/data'; // Importing functions for data fetching and updating
import { loadStripe } from '@stripe/stripe-js'; // Stripe integration for payment processing

// Load environment variables
config();

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function TrainerDetailPage() {
  // Accessing query parameters from the URL
  const searchParams = useSearchParams();
  const { trainerId } = useParams();
  const useremail = searchParams.get('email');
  // State management for various form fields and loading state
  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<TrainerSlots[]>([]);
  const [levels, setLevels] = useState<Level[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetching available levels and services when the component mounts
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

    // Fetch levels and services when the component is loaded
    fetchLevels();
    fetchServices();
  }, []);

  // Handle change event for the date dropdown
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDate = e.target.value;
    setSelectedDate(selectedDate);
    console.log('Selected date:', selectedDate);
  };

  // Fetch available time slots when a date is selected
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

  // Fetch available dates for the selected trainer
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

  // Handle change events for time slots, levels, and services
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

  // create appointment if clients decide to pay later
  

  // Handle form submission to start the checkout process
  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that all necessary fields have been selected
    if (!selectedSlot || !selectedLevel || !selectedService || !selectedDate || !useremail) {
      alert('Please select all fields');
      return;
    }
  
    setLoading(true);
  
    try {
      // Send a POST request to create a checkout session with Stripe
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Entrenamiento Individual',
          amount: 2000, // amount in cents (e.g., $1.00)
          slot_id: selectedSlot,
          level_id: selectedLevel,
          service_id: selectedService,
          date: selectedDate,
          email: useremail,
          trainer_id: Array.isArray(trainerId) ? trainerId[0] : trainerId,
        }),
      });
  
      // Parse the response to get the session ID and redirect to Stripe's checkout page
      const { id } = await response.json();
      const stripe = await stripePromise;
  
      const { error } = await stripe?.redirectToCheckout({ sessionId: id }) || {};
  
      // Handle any errors during the checkout redirect
      if (error) {
        console.error('Error during checkout redirect:', error);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render the form and checkout button
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Fechas Disponibles</h1>
      {error && <div className="bg-red-500 text-white p-2 rounded">{error}</div>}
      <form onSubmit={handleCheckout} className="space-y-4">
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
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200"
        >
          {loading ? 'Processing...' : 'Checkout and Reserve'}
        </button>
      </form>
    </div>
  );
}





'use client';

// Import necessary modules and functions
import { config } from 'dotenv'; // To load environment variables
import React, { useState, useEffect } from 'react'; // React hooks
import { useParams, useSearchParams,useRouter } from 'next/navigation'; // Hooks for accessing route parameters and query strings
import { TrainerSlots, Service, Level } from '@/app/lib/definitions'; // Importing types and definitions
import { fetchSlots, fetchAvailableDates, createAppointment,updateTimeSlotStatus } from '@/app/lib/data'; // Importing functions for data fetching and updating
import { loadStripe } from '@stripe/stripe-js'; // Stripe integration for payment processing
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  ClockIcon, 
  AcademicCapIcon, 
  CreditCardIcon,
  BookmarkIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Load environment variables
config();

// Initialize Stripe with the publishable key from environment variables
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function TrainerDetailPage() {
  const router = useRouter();
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

  // Handle reserving without payment
  const handleReserveWithoutPaying = async () => {
    if (!selectedSlot || !selectedLevel || !selectedService || !selectedDate || !useremail) {
      alert('Porfavor no deje nada vacio');
      return;
    }

    try {
      await createAppointment(selectedSlot, useremail, selectedLevel, Number(trainerId), selectedService, selectedDate, 'No Pagado');
      alert('Su cita ha sido reservada.');
      await updateTimeSlotStatus(selectedSlot,Number(trainerId),selectedDate,'Unavailable');
      router.push(`/dashboard/citas`);
    } catch (error) {
      console.error('Error creating appointment without payment:', error);
      alert('Failed to reserve appointment.');
    }
  };

  // Render the form and checkout button
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30">
          <CalendarIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Reserva tu Sesión</h1>
          <p className="text-gray-400 mt-1">Selecciona la fecha, hora y detalles de tu entrenamiento</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="bg-red-900/20 border-red-500/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
              <p className="text-red-400">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleCheckout} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <CalendarIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Fecha</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <select
                  id="dates"
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
                  onClick={handleDateDropdown}
                  onChange={handleDateChange}
                  value={selectedDate}
                >
                  <option value="" disabled>Seleccione una fecha</option>
                  {dates.map((date) => (
                    <option key={date} value={date} className="bg-gray-800">{date}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </CardContent>
          </Card>

          {/* Time Slots */}
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-magenta-500/20 border border-purple-500/30">
                  <ClockIcon className="w-5 h-5 text-purple-400" />
                </div>
                <CardTitle className="text-white">Hora</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <select
                  id="slots"
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                  onClick={handleSlotDropdownClick}
                  onChange={handleSlotChange}
                  value={selectedSlot ?? ''}
                >
                  <option value="" disabled>Seleccione una hora</option>
                  {slots.map((slot) => (
                    <option key={slot.slot_id} value={slot.slot_id} className="bg-gray-800">
                      {slot.starttime} - {slot.endtime}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </CardContent>
          </Card>

          {/* Level Selection */}
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                  <AcademicCapIcon className="w-5 h-5 text-green-400" />
                </div>
                <CardTitle className="text-white">Nivel</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <select
                  id="levels"
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer hover:border-green-500/50 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300"
                  onChange={handleLevelChange}
                  value={selectedLevel ?? ''}
                >
                  <option value="" disabled>Seleccione su nivel de experiencia</option>
                  {levels.map((level) => (
                    <option key={level.level_id} value={level.level_id} className="bg-gray-800">
                      {level.level}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </CardContent>
          </Card>

          {/* Service Selection */}
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30">
                  <BookmarkIcon className="w-5 h-5 text-orange-400" />
                </div>
                <CardTitle className="text-white">Servicio</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <select
                  id="services"
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer hover:border-orange-500/50 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-transparent transition-all duration-300"
                  onChange={handleServiceChange}
                  value={selectedService ?? ''}
                >
                  <option value="" disabled>Seleccione un servicio</option>
                  {services.map((service) => (
                    <option key={service.service_id} value={service.service_id} className="bg-gray-800">
                      {service.servicename}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-center">Finalizar Reserva</CardTitle>
            <CardDescription className="text-center">
              Elige tu método de pago preferido
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <CreditCardIcon className="w-5 h-5 mr-2" />
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Procesando...
                  </div>
                ) : (
                  'Pagar y Reservar'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={handleReserveWithoutPaying}
                className="w-full h-14 bg-transparent border-2 border-gray-600 text-gray-300 hover:bg-gray-800/50 hover:border-gray-500 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <BookmarkIcon className="w-5 h-5 mr-2" />
                Pagar Luego y Reservar
              </Button>
            </div>
            
            <p className="text-gray-400 text-sm text-center mt-4">
              💡 Tip: Pagar ahora garantiza tu lugar y evita cancelaciones
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}






'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { fetchInfoFromAppID, fetchAvailableDates, fetchSlots, editAppointment } from '@/app/lib/data';
import { Level, Service, TrainerSlots } from '@/app/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  ClockIcon, 
  AcademicCapIcon, 
  BookmarkIcon,
  PencilIcon,
  ChevronDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function AppDetails() {
  const router = useRouter();
  const { appId } = useParams();
  const [appDetails, setAppDetails] = useState<any>(null);
  const [levels, setLevels] = useState<Level[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [slots, setSlots] = useState<TrainerSlots[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getAppDetails = async () => { //function for getting the appointment info of the desired appointment(using the app_id)to edit the appointment info
    try {
      if (!appId) return; //error handling

      const parsedAppId = parseInt(Array.isArray(appId) ? appId[0] : appId, 10); //checks if appId is an array, if it is an array appId is set to the first element of the array
      // if it is not an array, it is set to its numeric value

      if (isNaN(parsedAppId)) { //if app id is not a number, throw an error
        throw new Error('Invalid appId');
      }

      const result = await fetchInfoFromAppID(parsedAppId); //fetch the appointment info using the appId
      setAppDetails(result); // store the app info using state
    } catch (error) { //error handling
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  useEffect(() => { //execute the function that fetches the app info
    getAppDetails(); // this useEffect runs when the component mounts and everytime the appId changes
  }, [appId]);

  useEffect(() => { //fetching levels and services using api routes I defined
    async function fetchLevels() {
      try {
        const response = await fetch(`/api/levels`); //api route for levels
        if (!response.ok) {
          throw new Error('Failed to fetch levels');
        }
        const data = await response.json();
        setLevels(data); //store the info from the function as state for later use
      } catch (error) { //error handling
        if (error instanceof Error) {
          console.error('Error fetching levels:', error);
          setError(error.message);
        }
      }
    }

    async function fetchServices() {
      try {
        const response = await fetch(`/api/services`); //api route for services
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data); //store the info from the function as state for later use
      } catch (error) { //error handling
        if (error instanceof Error) {
          console.error('Error fetching services:', error);
          setError(error.message);
        }
      }
    }

    fetchLevels();
    fetchServices();
  }, []); //the useEffect is execute only when the component mounts

  //function that handles the levels dropdown, when the user selects a level, its levelId is store for later use when creating the appointment
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const levelId = Number(e.target.value);
    setSelectedLevel(levelId);
    console.log('Selected level_id:', levelId);
  };

  //function that handles the services dropdown, when the user selects a service, its serviceId is store for later use when creating the appointment
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const serviceId = Number(e.target.value);
    setSelectedService(serviceId);
    console.log('Selected service_id:', serviceId);
  };

  //function that handles the date dropdown, when the user selects a date, its value is store for later use when creating the appointment
  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDate(e.target.value);
    console.log('Selected date:', e.target.value);
  };

  //function that handles the slots dropdown, when the user selects a slot, its slotId is store for later use when creating the appointment
  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotId = Number(e.target.value);
    setSelectedSlot(slotId);
    console.log('Selected slot_id:', slotId);
  };

  //displays the slots, depending on the date
  const handleSlotDropdownClick = async () => {
    try {
      if (!selectedDate || !appDetails?.trainer_id) return;
      const parsedTrainerId = Array.isArray(appDetails.trainer_id) ? appDetails.trainer_id[0] : appDetails.trainer_id;
      const slotsData = await fetchSlots(parseInt(parsedTrainerId), selectedDate); // function that fetches the slots for a given date
      setSlots(slotsData); //storing the slots info as state
    } catch (error) { //error handling
      if (error instanceof Error) {
        console.error('Error fetching available time slots:', error);
        setError(error.message);
      }
    }
  };

  //displays the dates given a trainerId becuase every trainer may have distinct schedules
  const handleDateDropdown = async () => {
    try {
      if (!appDetails?.trainer_id) return; //if trainerId does not exist, something is wrong so return out
      const parsedTrainerId = Array.isArray(appDetails.trainer_id) ? appDetails.trainer_id[0] : appDetails.trainer_id; //checking trainerId to set its value accordingly and avoid errors
      const datesData = await fetchAvailableDates(parseInt(parsedTrainerId)); //fetch the trainer's available dates
      setDates(datesData || []); // store dates as state or as an empty array if the function returns nothing
    } catch (error) { //error handling
      if (error instanceof Error) {
        console.error('Error fetching available dates:', error);
        setError(error.message);
      }
    }
  };

  //function that edits an appointment with the new information a user enters
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (appDetails) {
      try {
        const parsedAppId = parseInt(Array.isArray(appId) ? appId[0] : appId, 10); //checking appId to set its value accordingly and avoid errors
        const result = await editAppointment(
          parsedAppId,
          appDetails.slot_id,
          selectedSlot ?? 0,
          appDetails.trainer_id,
          appDetails.service_id,
          selectedService ?? 0,
          appDetails.level_id,
          selectedLevel ?? 0,
          selectedDate,
          appDetails.appointment_date
        ); //edit appointment
        console.log('Appointment edited:', result);
        alert('Appointment edited successfully');
        router.push(`/dashboard/citas`); //if the edit is successfull redirect back to appointments page
        
      } catch (error) {
        console.error('Error editing appointment:', error);
        alert('Failed to edit appointment');
      }
    } else {
      alert('Please select all fields');
    }
  };

  if (!appDetails) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400">Cargando detalles de la cita...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30">
          <PencilIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Editar Cita</h1>
          <p className="text-gray-400 mt-1">Modifica los detalles de tu sesión de entrenamiento</p>
        </div>
      </div>

      {/* Current Appointment Info */}
      <Card className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
            Cita Actual
          </CardTitle>
          <CardDescription>
            Información de tu cita programada
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Entrenador</p>
              <p className="text-white font-medium">{appDetails.trainer_fullname}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Fecha</p>
              <p className="text-white font-medium">{appDetails.appointment_date}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Hora</p>
              <p className="text-white font-medium">{appDetails.start_time} - {appDetails.end_time}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Servicio</p>
              <p className="text-white font-medium">{appDetails.service}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Edit Form */}
      <form onSubmit={handleEdit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Date Selection */}
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30">
                  <CalendarIcon className="w-5 h-5 text-cyan-400" />
                </div>
                <CardTitle className="text-white">Nueva Fecha</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <select
                  id="dates"
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer hover:border-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
                  onChange={handleDateChange}
                  onClick={handleDateDropdown}
                  value={selectedDate}
                >
                  <option value="" disabled>{appDetails.appointment_date}</option>
                  {dates.map((date) => (
                    <option key={date} value={date} className="bg-gray-800">{date}</option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </CardContent>
          </Card>

          {/* Time Slot Selection */}
          <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-magenta-500/20 border border-purple-500/30">
                  <ClockIcon className="w-5 h-5 text-purple-400" />
                </div>
                <CardTitle className="text-white">Nueva Hora</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <select
                  id="slots"
                  className="w-full p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-300"
                  onChange={handleSlotChange}
                  onClick={handleSlotDropdownClick}
                  value={selectedSlot ?? ''}
                >
                  <option value="" disabled>{appDetails.start_time} - {appDetails.end_time}</option>
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
                <CardTitle className="text-white">Nuevo Nivel</CardTitle>
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
                  <option value="" disabled>{appDetails.level}</option>
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
                <CardTitle className="text-white">Nuevo Servicio</CardTitle>
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
                  <option value="" disabled>{appDetails.service}</option>
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

        {/* Save Button */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <Button
              type="submit"
              className="w-full h-14 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <PencilIcon className="w-5 h-5 mr-2" />
              Guardar Cambios
            </Button>
            
            <p className="text-gray-400 text-sm text-center mt-4">
              💡 Los cambios se aplicarán inmediatamente después de guardar
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}





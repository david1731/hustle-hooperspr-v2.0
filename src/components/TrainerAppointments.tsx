'use client';

import React, { useEffect, useState } from 'react';
import { AppointmentQueryResult, TrainerSlots } from '@/app/lib/definitions';
import { fetchAvailableTrainerSlots, deleteAvailableTrainerSlot, trainerDeleteApp} from '@/app/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  XMarkIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

interface AppointmentsListProps {
  appointments: AppointmentQueryResult[];
  trainerId: number;
}

const TrainerAppointmentsList: React.FC<AppointmentsListProps> = ({ appointments, trainerId }) => {
  const [availableSlots, setAvailableSlots] = useState<TrainerSlots[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => { //fetches a trainer's available slots 
      try {
        //console.log("Fetching slots for trainerId:", trainerId);
        const slots = await fetchAvailableTrainerSlots(trainerId); //slots result stored here
        //console.log("slots:", slots);
        setAvailableSlots(slots); //slots result stored as state
      } catch (error) { //error handling
        console.error('Error fetching available slots:', error);
        setError('Failed to load available slots.');
      }
    };

    fetchSlots();
  }, [trainerId]);

  const handleDeleteSlot = async (slot_id: number, date: string) => { //execute deleting a time slot
    try {
      await deleteAvailableTrainerSlot(slot_id, date, trainerId); //deletes the slot from the database
      // Update the available slots list after deletion
      setAvailableSlots(prevSlots => prevSlots.filter(slot => slot.slot_id !== slot_id || slot.date !== date)); // Create a new array with all slots that do not match the given slot_id and date
       // Keep the slot if the slot_id is different or the date is different
    } catch (error) { //error handling
      console.error('Error deleting slot:', error);
      setError('Failed to delete slot.');
    }
  };

  const handleDeleteApp = async (app_id: number) => { //deletes appointment from database
    try{
      await trainerDeleteApp(app_id); //imported function from data.ts
      window.location.reload(); //reload the page to so that changes are reflected
    } catch(error){ //error handling
      console.error("Could not delete appointment in TrainerAppointmentList.tsx");
      setError("Failed to delete shot");
    }
  };

  return (
    <div className="space-y-8">
      {/* Appointments Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30">
            <CalendarIcon className="w-6 h-6 text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Tus Citas</h1>
        </div>
        
        {appointments.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8 text-center">
              <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No tienes citas programadas.</p>
              <p className="text-gray-500 text-sm mt-2">Las nuevas citas aparecerán aquí</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {appointments.map(appointment => (
              <Card key={appointment.app_id} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 hover:border-cyan-500/30 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                        <UserIcon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg group-hover:text-cyan-400 transition-colors">
                          {appointment.client_name}
                        </CardTitle>
                        <CardDescription className="text-gray-400 mt-1">
                          {appointment.service}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Level Badge */}
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-xs font-medium">
                      Nivel: {appointment.level}
                    </span>
                  </div>
                  
                  {/* Time and Date Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-300">
                      <ClockIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-sm">
                        {appointment.starttime} - {appointment.endtime}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-gray-300">
                      <CalendarIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                      <span className="text-sm">
                        {appointment.appointment_date}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        appointment.status === 'Pagado' 
                          ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                          : 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                      }`}>
                        Estado: {appointment.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Cancel Button */}
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                      onClick={() => handleDeleteApp(appointment.app_id)}
                    >
                      <XMarkIcon className="w-4 h-4 mr-2" />
                      Cancelar Cita
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Available Slots Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-magenta-500/20 border border-purple-500/30">
            <ClockIcon className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Fechas y Horas Disponibles</h2>
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
        
        {availableSlots.length === 0 ? (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-8 text-center">
              <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No tienes fechas y horas disponibles.</p>
              <p className="text-gray-500 text-sm mt-2">Agrega nuevos horarios para que los estudiantes puedan reservar</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {availableSlots.map((slot, index) => (
              <Card key={index} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 hover:border-purple-500/30 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500/20 to-magenta-500/20 border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                      <CalendarIcon className="w-5 h-5 text-purple-400" />
                    </div>
                    <CardTitle className="text-white text-lg group-hover:text-purple-400 transition-colors">
                      {slot.date}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Time Info */}
                  <div className="flex items-center gap-3 text-gray-300">
                    <ClockIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span className="text-sm font-medium">
                      {slot.starttime} - {slot.endtime}
                    </span>
                  </div>
                  
                  {/* Delete Button */}
                  <div className="pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                      onClick={() => handleDeleteSlot(slot.slot_id, slot.date)}
                    >
                      <TrashIcon className="w-4 h-4 mr-2" />
                      Eliminar Hora
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerAppointmentsList;





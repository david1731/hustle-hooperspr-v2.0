import React, { useState, useEffect } from 'react';
import { fetchTimeSlots, insertTrainerTimeSlot } from '@/app/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  CalendarIcon, 
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

interface TimeSlot {
  slot_id: number;
  starttime: string;
  endtime: string;
}

const TrainerWorkForm: React.FC<{ trainer_id: number }> = ({ trainer_id }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSlots = async () => { //fetch generic timeslots
      try {
        const slots = await fetchTimeSlots(); //stores query result
        setTimeSlots(slots); //stores slots as state
      } catch (error) { //error handling
        setError('Failed to load time slots.');
      }
    };

    fetchSlots();
  }, []);

  const formatDateForDB = (date: Date): string => {
    const monthNames = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const month = monthNames[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    return `${month} ${day}, ${year}`;
  };

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value); 
    setSelectedSlotId(selectedId); //store the selected slot by the user as state for db insertion
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedSlotId && selectedDate) {
      setLoading(true);
      try {
        const formattedDate = formatDateForDB(selectedDate);
        await insertTrainerTimeSlot(trainer_id, selectedSlotId, 'Available', formattedDate); //insert into db new trainer time slot
        alert('Su horario ha sido modificado exitosamente!');
        setSelectedSlotId(null); //reset the slot id
        setSelectedDate(undefined); //reset the date
        setError(null);
      } catch (error) { //error handling
        console.error('Error modificando su horario:', error);
        setError('Failed to add work slot.');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Seleccione una hora y fecha.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30">
          <CalendarIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Modifica tus Horarios</h2>
          <p className="text-gray-400 mt-1">Agrega nuevas fechas y horas disponibles para tus estudiantes</p>
        </div>
      </div>

      {/* Form Card */}
      <Card className="bg-gray-900/50 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <ClockIcon className="w-5 h-5 text-cyan-400" />
            Agregar Disponibilidad
          </CardTitle>
          <CardDescription>
            Selecciona una fecha y horario para que los estudiantes puedan reservar
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Fecha
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal bg-gray-800/50 border-gray-700 text-white hover:bg-gray-800/70 hover:border-gray-600",
                      !selectedDate && "text-gray-400"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                    {selectedDate ? (
                      format(selectedDate, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                    className="bg-gray-800 text-white"
                  />
                </PopoverContent>
              </Popover>
              
              {selectedDate && (
                <div className="mt-2 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                  <p className="text-gray-300 text-sm">
                    <span className="text-gray-400">Fecha seleccionada:</span>{' '}
                    <span className="text-white font-medium">{formatDateForDB(selectedDate)}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Time Slot Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Horario Disponible
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={selectedSlotId ?? ''}
                  onChange={handleSlotChange}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300"
                >
                  <option value="" disabled>Seleccione una hora</option>
                  {timeSlots.map(slot => (
                    <option key={slot.slot_id} value={slot.slot_id} className="bg-gray-800">
                      {slot.starttime} - {slot.endtime}
                    </option>
                  ))}
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <ExclamationTriangleIcon className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Agregando...
                </div>
              ) : (
                <>
                  <CheckCircleIcon className="w-5 h-5 mr-2" />
                  Agregar Horario
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-semibold">Gestión de Horarios</span>
          </div>
          <p className="text-gray-400 text-sm">
            Los horarios agregados estarán disponibles para que los estudiantes puedan reservar sus sesiones de entrenamiento.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainerWorkForm;


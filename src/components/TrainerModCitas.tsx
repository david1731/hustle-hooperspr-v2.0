import React, { useState, useEffect } from 'react';
import { fetchTimeSlots, insertTrainerTimeSlot } from '@/app/lib/data'; // Assuming these functions are implemented

interface TimeSlot {
  slot_id: number;
  starttime: string;
  endtime: string;
}

const TrainerWorkForm: React.FC<{ trainer_id: number }> = ({ trainer_id }) => {
  const [date, setDate] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const slots = await fetchTimeSlots();
        setTimeSlots(slots);
      } catch (error) {
        setError('Failed to load time slots.');
      }
    };

    fetchSlots();
  }, []);

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    console.log("Selected Slot ID:", selectedId); // Log the slot_id to the console
    setSelectedSlotId(selectedId);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedSlotId && date) {
      try {
        await insertTrainerTimeSlot(trainer_id, selectedSlotId, 'Available', date);
        alert('Work slot added successfully!');
        setSelectedSlotId(null);
      } catch (error) {
        console.error('Error inserting work slot:', error);
        setError('Failed to add work slot.');
      }
    } else {
      setError('Please select a time slot and enter a date.');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Modifica tus horas</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Fecha:</label>
          <input
            type="text"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="Ej: Enero 1, 2024"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Horarios:</label>
          <select
            value={selectedSlotId ?? ''}
            onChange={handleSlotChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>Seleccione una hora</option>
            {timeSlots.map(slot => (
              <option key={slot.slot_id} value={slot.slot_id}>
                {slot.starttime} - {slot.endtime}
              </option>
            ))}
          </select>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200">
          Submit
        </button>
      </form>
    </div>
  );
};

export default TrainerWorkForm;


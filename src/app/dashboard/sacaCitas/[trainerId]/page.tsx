'use client';

import React, { useEffect, useState } from 'react';
import { useRouter,useSearchParams } from 'next/navigation';
import { TrainerSlots } from '@/app/lib/definitions';

export default function TrainerDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const useremail = searchParams.get('email');
  const trainerIdString = searchParams.get('trainerId');

  const [slots, setSlots] = useState<TrainerSlots[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  useEffect(() => {
    async function fetchSlots() {
      try {
        if (!trainerIdString){
          console.log("TrainerId:",trainerIdString);
          console.log("user email:",useremail);
          throw new Error('trainerId is required');
        } 

        const trainerId = parseInt(trainerIdString, 10);
        if (isNaN(trainerId)) throw new Error('Invalid trainerId');

        const response = await fetch(`/api/slots/${trainerId}`);
        console.log('Fetch slots response:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch slots');
        }
        const data = await response.json();
        console.log('Fetched slots:', data);
        setSlots(data);
      } catch (error) {
        if(error instanceof Error){
          console.error('Error fetching slots:', error);
          setError(error.message);
        }
      }
    }

    fetchSlots();
  }, [trainerIdString]);

  const handleSlotChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const slotId = Number(e.target.value);
    setSelectedSlot(slotId);
    console.log('Selected slot_id:', slotId);
  };

  return (
    <div>
      <h1>Available Slots</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <select onChange={handleSlotChange} value={selectedSlot ?? ''}>
        <option value="" disabled>Select a slot</option>
        {slots.map((slot) => (
          <option key={slot.slot_id} value={slot.slot_id}>
            {slot.start_time} - {slot.endtime} on {slot.date}
          </option>
        ))}
      </select>
    </div>
  );
};


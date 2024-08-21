'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createAppointment, updateTimeSlotStatus } from '@/app/lib/data';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasCreatedAppointment = useRef(false); // Ref to track if appointment creation has been triggered

  useEffect(() => {
    const createAppointmentAndRedirect = async () => {
      if (hasCreatedAppointment.current) return; // Prevent duplicate execution

      const sessionId = searchParams.get('session_id');
      const slotId = parseInt(searchParams.get('slot_id') || '0', 10);
      const levelId = parseInt(searchParams.get('level_id') || '0', 10);
      const serviceId = parseInt(searchParams.get('service_id') || '0', 10);
      const date = searchParams.get('date') || '';
      const email = searchParams.get('email') || '';
      const trainerId = parseInt(searchParams.get('trainer_id') || '0', 10);

      if (sessionId && slotId && levelId && serviceId && date && email && trainerId) {
        try {
          // Mark as triggered
          hasCreatedAppointment.current = true;

          // Create the appointment
          await createAppointment(slotId, email, levelId, trainerId, serviceId, date);
          await updateTimeSlotStatus(slotId, trainerId, date, 'Unavailable');

          // Redirect to the dashboard
          router.push(`/dashboard`);
        } catch (error) {
          console.error('Error creating appointment:', error);
        }
      }
    };

    createAppointmentAndRedirect();
  }, [searchParams, router]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Processing...</h1>
      <p>Creating your appointment and redirecting you to the dashboard.</p>
    </div>
  );
}


'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createAppointment, updateTimeSlotStatus } from '@/app/lib/data';

export default function SuccessComponent() {
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

      console.log({
        sessionId,
        slotId,
        levelId,
        serviceId,
        date,
        email,
        trainerId,
      });

      if (sessionId && slotId && levelId && serviceId && date && email && trainerId) {
        try {
          // Mark as triggered
          hasCreatedAppointment.current = true;

          // Create the appointment
          await createAppointment(slotId, email, levelId, trainerId, serviceId, date, 'Pagado');
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
    <div className="flex flex-col items-center justify-center min-h-screen mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Processing...</h1>
      <div className="loader"></div> {/* Loader added here */}
      <p className="mt-4 text-lg text-center">Creando su cita, sera redirigido a su portal enseguida.</p>

      <style jsx>{`
        .loader {
          width: 64px; /* Increased loader size */
          height: 64px; /* Increased loader size */
          border: 6px solid #FFF;
          border-bottom-color: #FF3D00;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;
          animation: rotation 1s linear infinite;
        }

        @keyframes rotation {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>

  );
}



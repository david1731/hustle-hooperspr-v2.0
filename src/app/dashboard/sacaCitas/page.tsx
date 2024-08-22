// Displays Trainers
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/context/SessionContext';
import { Trainer } from '@/app/lib/definitions';
import '../../../styles/styling.css';

export default function SacaCitasPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const router = useRouter();
  const user = useSession();

  useEffect(() => {
    async function loadTrainers() {
      try {
        const response = await fetch('/api/trainers');
        if (!response.ok) {
          throw new Error('Failed to fetch trainers');
        }
        const trainersData = await response.json();
        setTrainers(trainersData);
        console.log("Trainers", trainers);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching trainers:', error);
          setError(error.message);
        } else {
          console.error('Unknown error:', error);
          setError('An unknown error occurred');
        }
      }
    }

    loadTrainers();
  }, []);

  const handleTrainerClick = (trainerId: number) => {
    router.push(`/dashboard/sacaCitas/${trainerId}?email=${user?.email}`);
  };

  return (
    <div className="mt-5">
      <h1 className="mb-4 text-4xl antialiased">Escoge tú Entrenador</h1>
      <div className="flex flex-wrap justify-start">
        {trainers.map(trainer => (
          <div key={trainer.trainer_id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <div className="card bg-white shadow-md hover:shadow-lg transition-shadow duration-300"
              onClick={() => handleTrainerClick(trainer.trainer_id)}>
              <div className="card-body text-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN4NYaMGS8d806xsl4U3GFR8jif0vKMWlPRg&s"
                  className="card-img-top img-thumbnail rounded-md w-24 h-24 mx-auto mt-4"
                  alt={`${trainer.fullname}`}
                />
                <h5 className="card-title mt-4">{trainer.fullname}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function setError(message: string) {
  throw new Error('Function not implemented.');
}




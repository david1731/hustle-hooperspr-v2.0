//src/app/dashboard/sacaCitas/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/context/SessionContext';
import { fetchTrainers } from '@/app/lib/data';
import { Trainer } from '@/app/lib/definitions';

const SacaCitasPage = () => {
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
    <div className="container mt-5">
      <h1 className="mb-4">Choose a Professional</h1>
      <div className="row">
        {trainers.map((trainer) => (
          <div key={trainer.trainer_id} className="col-md-4 mb-4">
            <div className="card" onClick={() => handleTrainerClick(trainer.trainer_id)}>
              <img src="/placeholder.jpg" className="card-img-top" alt={`${trainer.name} ${trainer.lastname}`} />
              <div className="card-body">
                <h5 className="card-title">{trainer.name} {trainer.lastname}</h5>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SacaCitasPage;

function setError(message: string) {
  throw new Error('Function not implemented.');
}

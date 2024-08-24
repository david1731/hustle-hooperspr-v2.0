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

  // List of image URLs corresponding to the trainers
  const imageUrls = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoGVLO0HPugTzEdyM1raso8Vk2FGMlYLkXyQ&s',
    '/yayi.jpeg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg'
    // Add more URLs as needed
  ];

  useEffect(() => {
    async function loadTrainers() {
      try {
        const response = await fetch('/api/trainers');
        if (!response.ok) {
          throw new Error('Failed to fetch trainers');
        }
        const trainersData = await response.json();
        console.log("Fetched Trainers:", trainersData); // Log the fetched data
        setTrainers(trainersData);
        console.log("State Trainers:", trainers); // Log the state after setting
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
        {trainers.map((trainer, index) => (
          <div key={trainer.trainer_id} className="p-2 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
            <div 
              className="card bg-white shadow-md hover:shadow-lg transition-all duration-300"
              onClick={() => handleTrainerClick(trainer.trainer_id)}>
              <div className="card-body text-center hover:bg-gray-100">
                <img
                  src={imageUrls[index]} // Get the corresponding image URL
                  className="rounded-md w-32 h-32 mx-auto mt-4 object-cover"
                  alt={`${trainer.fullname}`}
                />
                <h5 className="card-title mt-4 text-xl">{trainer.fullname}</h5>
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






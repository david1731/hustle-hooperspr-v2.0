'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/context/SessionContext';
import { Trainer } from '@/app/lib/definitions';
import { fetchTrainers } from '@/app/lib/data';
import '../../../styles/styling.css';

export default function SacaCitasPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const router = useRouter();
  const user = useSession();

  // List of image URLs corresponding to the trainers
  const imageUrls = [
    '/yayi.jpeg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg'
    // Add more URLs as needed
  ];

  // Function to fetch trainers and update the state
  const fetchedTrainers = async () => {
    try {
      const trainersInfo = await fetchTrainers(); // Assuming fetchTrainers is defined and imported
      setTrainers(trainersInfo);
    } catch (error) {
      console.error("No trainer found", error);
    }
  };

  useEffect(() => {
    fetchedTrainers(); // Fetch trainers on component mount

    // Add a beforeunload event listener if on the browser
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', fetchedTrainers);
    }

    // Clean up event listener on component unmount
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', fetchedTrainers);
      }
    };
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







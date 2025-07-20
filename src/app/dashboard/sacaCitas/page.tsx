'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/app/context/SessionContext';
import { Trainer } from '@/app/lib/definitions';
import { fetchTrainers } from '@/app/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  UserGroupIcon, 
  StarIcon, 
  ChevronRightIcon,
  AcademicCapIcon 
} from '@heroicons/react/24/outline';

export default function SacaCitasPage() {
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const user = useSession();

  // List of image URLs corresponding to the trainers
  const imageUrls = [
    '/yayi.jpeg',
    'https://example.com/image3.jpg',
    'https://example.com/image4.jpg'
  ];

  // Function to fetch trainers and update the state
  const fetchedTrainers = async () => {
    try {
      setLoading(true);
      const trainersInfo = await fetchTrainers();
      setTrainers(trainersInfo);
    } catch (error) {
      console.error("No trainer found", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchedTrainers();

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', fetchedTrainers);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', fetchedTrainers);
      }
    };
  }, []);

  const handleTrainerClick = (trainerId: number) => {
    router.push(`/dashboard/sacaCitas/${trainerId}?email=${user?.email}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          <p className="text-gray-400">Cargando entrenadores...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30">
          <UserGroupIcon className="w-8 h-8 text-cyan-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Escoge tu Entrenador</h1>
          <p className="text-gray-400 mt-1">Selecciona el entrenador perfecto para tu nivel y objetivos</p>
        </div>
      </div>

      {/* Trainers Grid */}
      {trainers.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-8 text-center">
            <UserGroupIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No hay entrenadores disponibles en este momento.</p>
            <p className="text-gray-500 text-sm mt-2">Por favor, intenta de nuevo más tarde.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trainers.map((trainer, index) => (
            <Card 
              key={trainer.trainer_id}
              className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer group overflow-hidden"
              onClick={() => handleTrainerClick(trainer.trainer_id)}
            >
              <CardHeader className="text-center pb-4">
                {/* Trainer Image */}
                <div className="relative mx-auto mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 group-hover:border-cyan-500/50 transition-all duration-300 group-hover:scale-105">
                    <img
                      src={imageUrls[index] || '/placeholder-trainer.jpg'}
                      className="w-full h-full object-cover"
                      alt={`${trainer.fullname}`}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.fullname)}&size=128&background=1f2937&color=06b6d4&bold=true`;
                      }}
                    />
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute -bottom-2 -right-2 p-2 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                  </div>
                </div>

                {/* Trainer Info */}
                <CardTitle className="text-white text-xl group-hover:text-cyan-400 transition-colors">
                  {trainer.fullname}
                </CardTitle>
                
                <CardDescription className="text-gray-400 flex items-center justify-center gap-1 mt-2">
                  <AcademicCapIcon className="w-4 h-4" />
                  Entrenador Profesional
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-0">
                {/* Specialties */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  <span className="px-2 py-1 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 text-xs">
                    Fundamentales
                  </span>
                </div>

                {/* Selection Button */}
                <div className="flex items-center justify-center gap-2 text-gray-400 group-hover:text-cyan-400 transition-colors">
                  <span className="text-sm font-medium">Seleccionar</span>
                  <ChevronRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Bottom Info */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <UserGroupIcon className="w-5 h-5 text-cyan-400" />
            <span className="text-white font-semibold">Entrenadores Excepcionales</span>
          </div>
          <p className="text-gray-400 text-sm">
            Cada entrenador te ayudará a desarrollar tus habilidades y alcanzar tu máximo potencial en el baloncesto.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}







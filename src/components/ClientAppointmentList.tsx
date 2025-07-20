'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { AppointmentQueryResult } from '@/app/lib/definitions';
import { fetchDeleteUpdateApp } from '@/app/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserIcon, 
  XMarkIcon, 
  PencilIcon,
  StarIcon 
} from '@heroicons/react/24/outline';

interface AppointmentsListProps {
  appointments: AppointmentQueryResult[];
}

const ClientAppointmentsList: React.FC<AppointmentsListProps> = ({ appointments }) => {
  const router = useRouter();
  
  const handleCancel = async (app_id: number) => {
    try {
      await fetchDeleteUpdateApp(app_id);
      window.location.reload();
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30">
          <CalendarIcon className="w-6 h-6 text-cyan-400" />
        </div>
        <h1 className="text-3xl font-bold text-white">Tus Citas</h1>
      </div>
      
      {appointments.length === 0 ? (
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-8 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No tienes citas pendientes.</p>
            <p className="text-gray-500 text-sm mt-2">¡Agenda tu primera sesión de entrenamiento!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            pagination={{ 
              clickable: true,
              bulletClass: 'swiper-pagination-bullet !bg-cyan-500',
              bulletActiveClass: 'swiper-pagination-bullet-active !bg-cyan-400'
            }}
            navigation={{
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev',
            }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-12"
          >
            {appointments.map(appointment => (
              <SwiperSlide key={appointment.app_id}>
                <Card className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 hover:border-cyan-500/30 transition-all duration-300 group h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                          <UserIcon className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg group-hover:text-cyan-400 transition-colors">
                            {appointment.trainer_fullname}
                          </CardTitle>
                          <CardDescription className="text-gray-400 flex items-center gap-1 mt-1">
                            <StarIcon className="w-4 h-4" />
                            {appointment.service}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Level Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 text-xs font-medium">
                        Nivel: {appointment.level}
                      </span>
                    </div>
                    
                    {/* Time and Date Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <ClockIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-sm">
                          {appointment.starttime} - {appointment.endtime}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-3 text-gray-300">
                        <CalendarIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="text-sm">
                          {appointment.appointment_date}
                        </span>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/50"
                        onClick={() => router.push(`/dashboard/citas/${appointment.app_id}`)}
                      >
                        <PencilIcon className="w-4 h-4" />
                        Editar
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                        onClick={() => handleCancel(appointment.app_id)}
                      >
                        <XMarkIcon className="w-4 h-4" />
                        Cancelar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Navigation Styling */}
          <style jsx global>{`
            .swiper-button-next,
            .swiper-button-prev {
              color: #06b6d4 !important;
              background: rgba(17, 24, 39, 0.8) !important;
              border: 1px solid rgba(6, 182, 212, 0.3) !important;
              border-radius: 0.5rem !important;
              width: 40px !important;
              height: 40px !important;
              margin-top: -20px !important;
            }
            
            .swiper-button-next:hover,
            .swiper-button-prev:hover {
              background: rgba(6, 182, 212, 0.1) !important;
              border-color: rgba(6, 182, 212, 0.5) !important;
            }
            
            .swiper-pagination-bullet {
              background: rgba(107, 114, 128, 0.5) !important;
              opacity: 1 !important;
            }
            
            .swiper-pagination-bullet-active {
              background: #06b6d4 !important;
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default ClientAppointmentsList;


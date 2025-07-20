'use client';
import React, { useEffect } from "react";
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon, 
  ChartBarIcon,
  FireIcon,
  PlusIcon,
  BookOpenIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function TrainerDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const { trainer_id } = params;

  useEffect(() => {
    if (!trainer_id) {
      router.push('/trainerSignin');
    }
  }, [trainer_id, router]);

  if (!trainer_id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  const quickStats = [
    { label: 'Citas Hoy', value: '8', icon: CalendarIcon, color: 'from-cyan-500 to-blue-500' },
    { label: 'Próxima Cita', value: '2:00 PM', icon: ClockIcon, color: 'from-magenta-500 to-purple-500' },
    { label: 'Estudiantes Totales', value: '24', icon: UserGroupIcon, color: 'from-orange-500 to-red-500' },
    { label: 'Horas Enseñadas', value: '156h', icon: ChartBarIcon, color: 'from-green-500 to-emerald-500' },
  ];

  const quickActions = [
    { title: 'Ver Mis Citas', description: 'Revisa tu horario de hoy', href: `/trainerSignin/${trainer_id}/trainerDashboard/citas`, icon: CalendarIcon },
    { title: 'Modificar Horarios', description: 'Ajusta tu disponibilidad', href: `/trainerSignin/${trainer_id}/trainerDashboard/modificaHoras`, icon: ClockIcon },
    { title: 'Estadísticas', description: 'Analiza tu rendimiento', href: '#', icon: ChartBarIcon },
  ];

  const recentActivity = [
    { activity: 'Cita completada con Juan Pérez', time: 'Hace 1 hora', type: 'completed' },
    { activity: 'Nueva cita agendada para mañana', time: 'Hace 2 horas', type: 'scheduled' },
    { activity: 'Horario actualizado para la semana', time: 'Ayer', type: 'update' },
  ];

  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-magenta-500/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30">
              <FireIcon className="w-8 h-8 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                ¡Bienvenido, Coach! 🏀
              </h1>
              <p className="text-gray-300 text-lg">
                Listo para inspirar y desarrollar talento
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <Card key={index} className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all duration-300 group">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} bg-opacity-20 group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              </div>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <BookOpenIcon className="w-6 h-6 text-cyan-400" />
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-magenta-500/10 hover:border-cyan-500/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-magenta-500/20 border border-cyan-500/30 group-hover:scale-110 transition-transform duration-300">
                  <action.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {action.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{action.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-cyan-400" />
          Actividad Reciente
        </h2>
        <Card className="bg-gray-900/50 border-gray-800">
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentActivity.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-300">
                  <div className={`w-3 h-3 rounded-full ${
                    item.type === 'completed' ? 'bg-green-500' :
                    item.type === 'scheduled' ? 'bg-blue-500' : 'bg-purple-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-white text-sm">{item.activity}</p>
                    <p className="text-gray-400 text-xs">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivational Quote */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-gray-700">
        <CardContent className="p-6 text-center">
          <blockquote className="text-lg text-gray-300 italic mb-2">
            &ldquo;Un coach toma un jugador y hace de él un atleta. Un gran coach toma un atleta y hace de él una persona.&rdquo;
          </blockquote>
          <cite className="text-cyan-400 text-sm">- Joe Ehrmann</cite>
        </CardContent>
      </Card>
    </div>
  );
}



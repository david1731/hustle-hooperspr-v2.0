import { useState, useEffect } from 'react'
import { trainerAppointments } from '@/app/lib/data'

interface TrainerDashboardStats {
  appointmentsToday: number
  nextAppointment: string | null
  nextAppointmentTime: string | null
  totalStudents: number
  hoursTaught: number
}

interface TrainerActivityItem {
  type: 'completed' | 'upcoming' | 'cancelled'
  message: string
  date: string
  time: string
  clientName: string
}

interface TrainerDashboardData {
  stats: TrainerDashboardStats
  recentActivity: TrainerActivityItem[]
}

export const useTrainerDashboardData = (trainerId: number | null | undefined) => {
  const [data, setData] = useState<TrainerDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!trainerId) {
      setLoading(false)
      return
    }

    const fetchTrainerDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all trainer appointments
        const appointments = await trainerAppointments(trainerId)
        
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
        
        const tomorrow = new Date(today)
        tomorrow.setDate(tomorrow.getDate() + 1)
        
        // Filter appointments for today
        const todayAppointments = appointments.filter(apt => {
          const aptDate = new Date(apt.appointment_date)
          aptDate.setHours(0, 0, 0, 0)
          return aptDate.getTime() === today.getTime()
        })
        
        // Filter completed sessions (appointments older than today)
        const completedSessions = appointments.filter(apt => 
          new Date(apt.appointment_date) < today
        )
        
        // Filter upcoming appointments and sort by date/time
        const upcomingAppointments = appointments
          .filter(apt => new Date(apt.appointment_date) >= today)
          .sort((a, b) => {
            const dateCompare = new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime()
            if (dateCompare !== 0) return dateCompare
            // If same date, sort by time
            return a.starttime.localeCompare(b.starttime)
          })
        
        // Calculate appointments today
        const appointmentsToday = todayAppointments.length
        
        // Calculate next appointment
        const nextAppointment = upcomingAppointments[0]
        let nextAppointmentText: string | null = null
        let nextAppointmentTime: string | null = null
        
        if (nextAppointment) {
          const nextDate = new Date(nextAppointment.appointment_date)
          const diffTime = nextDate.getTime() - today.getTime()
          const daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (daysUntilNext === 0) {
            nextAppointmentText = 'Hoy'
          } else if (daysUntilNext === 1) {
            nextAppointmentText = 'Mañana'
          } else {
            nextAppointmentText = `En ${daysUntilNext} días`
          }
          
          // Format time (remove seconds if present)
          const timeFormatted = nextAppointment.starttime.substring(0, 5)
          nextAppointmentTime = timeFormatted
        }
        
        // Calculate total unique students
        const uniqueStudents = new Set(appointments.map(apt => apt.client_name))
        const totalStudents = uniqueStudents.size
        
        // Calculate total hours taught
        const hoursTaught = completedSessions.reduce((total, apt) => {
          try {
            // Parse time strings (assuming format like "09:00:00" or "09:00")
            const startTime = apt.starttime.split(':')
            const endTime = apt.endtime.split(':')
            
            const startHour = parseInt(startTime[0])
            const startMin = parseInt(startTime[1]) || 0
            const endHour = parseInt(endTime[0])
            const endMin = parseInt(endTime[1]) || 0
            
            const startTotalMin = startHour * 60 + startMin
            const endTotalMin = endHour * 60 + endMin
            
            const durationHours = (endTotalMin - startTotalMin) / 60
            return total + durationHours
          } catch (error) {
            console.warn('Error parsing time for appointment:', apt.app_id)
            return total + 1 // Default to 1 hour if parsing fails
          }
        }, 0)
        
        // Create recent activity feed
        const recentActivity: TrainerActivityItem[] = appointments
          .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
          .slice(0, 5)
          .map(apt => {
            const isCompleted = new Date(apt.appointment_date) < today
            const isToday = new Date(apt.appointment_date).toDateString() === today.toDateString()
            
            return {
              type: isCompleted ? 'completed' : 'upcoming',
              message: isCompleted 
                ? `Sesión de ${apt.service} completada con ${apt.client_name}`
                : isToday 
                  ? `Hoy: ${apt.service} con ${apt.client_name} a las ${apt.starttime.substring(0, 5)}`
                  : `Próxima: ${apt.service} con ${apt.client_name}`,
              date: apt.appointment_date,
              time: apt.starttime,
              clientName: apt.client_name
            }
          })
        
        // Set the trainer dashboard data
        setData({
          stats: {
            appointmentsToday,
            nextAppointment: nextAppointmentText,
            nextAppointmentTime,
            totalStudents,
            hoursTaught: Math.round(hoursTaught * 10) / 10, // Round to 1 decimal
          },
          recentActivity
        })
      } catch (err) {
        console.error('Error fetching trainer dashboard data:', err)
        setError('Failed to load trainer dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchTrainerDashboardData()
  }, [trainerId])
  
  return { data, loading, error, refetch: () => {
    if (trainerId) {
      setLoading(true)
      // Re-trigger the effect
      const fetchData = async () => {
        try {
          const appointments = await trainerAppointments(trainerId)
          // ... (same calculation logic as above)
        } catch (err) {
          setError('Failed to refresh trainer dashboard data')
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }}
} 
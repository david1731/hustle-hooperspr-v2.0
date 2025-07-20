import { useState, useEffect } from 'react'
import { getUserAppointmentsByEmail } from '@/app/lib/data'

interface DashboardStats {
  sessionsCompleted: number
  nextAppointment: string | null
  daysUntilNext: number | null
  hoursTrained: number
  currentLevel: string
}

interface ActivityItem {
  type: 'completed' | 'upcoming'
  message: string
  date: string
  time: string
}

interface DashboardData {
  stats: DashboardStats
  recentActivity: ActivityItem[]
}

export const useDashboardData = (email: string | null | undefined) => {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    if (!email) {
      setLoading(false)
      return
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Fetch all user appointments
        const appointments = await getUserAppointmentsByEmail(email)
        
        const today = new Date()
        today.setHours(0, 0, 0, 0) // Reset time to start of day for accurate comparison
        
        // Filter completed sessions (appointments older than today)
        const completedSessions = appointments.filter(apt => 
          new Date(apt.appointment_date) < today
        )
        
        // Filter upcoming appointments
        const upcomingAppointments = appointments
          .filter(apt => new Date(apt.appointment_date) >= today)
          .sort((a, b) => new Date(a.appointment_date).getTime() - new Date(b.appointment_date).getTime())
        
        // Calculate sessions completed
        const sessionsCompleted = completedSessions.length
        
        // Calculate next appointment and days until
        const nextAppointment = upcomingAppointments[0]
        let nextAppointmentText: string | null = null
        let daysUntilNext: number | null = null
        
        if (nextAppointment) {
          const nextDate = new Date(nextAppointment.appointment_date)
          const diffTime = nextDate.getTime() - today.getTime()
          daysUntilNext = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
          
          if (daysUntilNext === 0) {
            nextAppointmentText = 'Hoy'
          } else if (daysUntilNext === 1) {
            nextAppointmentText = 'Mañana'
          } else {
            nextAppointmentText = `${daysUntilNext} días`
          }
        }
        
        // Calculate total hours trained
        const hoursTrained = completedSessions.reduce((total, apt) => {
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
        
        // Get current level from most recent session
        const recentSession = completedSessions
          .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())[0]
        const currentLevel = recentSession?.level || 'Principiante'
        
        // Create recent activity feed
        const recentActivity: ActivityItem[] = appointments
          .sort((a, b) => new Date(b.appointment_date).getTime() - new Date(a.appointment_date).getTime())
          .slice(0, 5)
          .map(apt => {
            const isCompleted = new Date(apt.appointment_date) < today
            return {
              type: isCompleted ? 'completed' : 'upcoming',
              message: isCompleted 
                ? `Sesión de ${apt.service} completada con ${apt.trainer_fullname}`
                : `Próxima sesión: ${apt.service} con ${apt.trainer_fullname}`,
              date: apt.appointment_date,
              time: apt.starttime
            }
          })
        
        // Set the dashboard data
        setData({
          stats: {
            sessionsCompleted,
            nextAppointment: nextAppointmentText,
            daysUntilNext,
            hoursTrained: Math.round(hoursTrained * 10) / 10, // Round to 1 decimal
            currentLevel
          },
          recentActivity
        })
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [email])
  
  return { data, loading, error, refetch: () => {
    if (email) {
      setLoading(true)
      // Re-trigger the effect
      const fetchData = async () => {
        try {
          const appointments = await getUserAppointmentsByEmail(email)
          // ... (same calculation logic as above)
        } catch (err) {
          setError('Failed to refresh dashboard data')
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }}
} 
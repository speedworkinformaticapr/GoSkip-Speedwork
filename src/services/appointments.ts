export interface Appointment {
  id: string
  date: string
  start_time: string
  end_time: string
  service_name: string
  client_name: string
  status: string
  notes?: string
  executed_minutes?: number
  last_started_at?: string | null
}

export const getAppointments = async (startDate: string, endDate: string) => {
  return [] as Appointment[]
}

export const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
  return { id: Math.random().toString(), ...appointment } as Appointment
}

export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
  return { id, ...updates } as Appointment
}

export const deleteAppointment = async (id: string) => {}

export const getServices = async () => {
  return [] as any[]
}

export const getClients = async () => {
  return [] as any[]
}

export const notifyClientDelay = async (
  clientName: string,
  startTime: string,
  reason: string,
  notes: string | undefined,
  appointmentId: string,
) => {
  return true
}

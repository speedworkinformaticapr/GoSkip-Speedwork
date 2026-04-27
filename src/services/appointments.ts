import pb from '@/lib/pocketbase/client'

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
  try {
    return (await pb.collection('appointments').getFullList({
      filter: `date >= "${startDate}" && date <= "${endDate}"`,
      sort: 'date,start_time',
    })) as unknown as Appointment[]
  } catch (e) {
    return [] as Appointment[]
  }
}

export const createAppointment = async (appointment: Omit<Appointment, 'id'>) => {
  try {
    return (await pb.collection('appointments').create(appointment)) as unknown as Appointment
  } catch (e) {
    return { id: Math.random().toString(), ...appointment } as Appointment
  }
}

export const updateAppointment = async (id: string, updates: Partial<Appointment>) => {
  try {
    return (await pb.collection('appointments').update(id, updates)) as unknown as Appointment
  } catch (e) {
    return { id, ...updates } as Appointment
  }
}

export const deleteAppointment = async (id: string) => {
  try {
    await pb.collection('appointments').delete(id)
  } catch {
    /* intentionally ignored */
  }
}

export const getServices = async () => {
  try {
    return await pb.collection('services').getFullList()
  } catch (e) {
    return [] as any[]
  }
}

export const getClients = async () => {
  try {
    return await pb.collection('clients').getFullList()
  } catch (e) {
    return [] as any[]
  }
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

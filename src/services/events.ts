import pb from '@/lib/pocketbase/client'

export type EventRow = any

export async function getEvents() {
  try {
    return await pb.collection('events').getFullList({ sort: '-date' })
  } catch (e) {
    return [
      {
        id: '1',
        name: 'Evento de Teste',
        date: new Date().toISOString(),
        location: 'Local de Teste',
        category: 'Categoria',
        description: 'Descrição do evento mock',
      },
    ] as EventRow[]
  }
}

export async function getAthleteByUserId(userId: string) {
  try {
    return await pb.collection('athletes').getFirstListItem(`user_id="${userId}"`)
  } catch (e) {
    return { id: '1', user_id: userId, name: 'Atleta Mock', cpf: '000.000.000-00' }
  }
}

export async function registerForEvent(eventId: string, athleteId: string) {
  try {
    return await pb
      .collection('event_registrations')
      .create({ event_id: eventId, athlete_id: athleteId, status: 'confirmed' })
  } catch (e) {
    return { id: 'mock-reg-id', event_id: eventId, athlete_id: athleteId, status: 'confirmed' }
  }
}

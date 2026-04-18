export type EventRow = any

export async function getEvents() {
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

export async function getAthleteByUserId(userId: string) {
  return { id: '1', user_id: userId, name: 'Atleta Mock', cpf: '000.000.000-00' }
}

export async function registerForEvent(eventId: string, athleteId: string) {
  return { id: 'mock-reg-id', event_id: eventId, athlete_id: athleteId, status: 'confirmed' }
}

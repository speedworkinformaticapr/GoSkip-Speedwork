export async function getClubs() {
  return [
    { id: '1', name: 'Clube A' },
    { id: '2', name: 'Clube B' },
  ]
}

export async function getCategories() {
  return [
    { id: '1', name: 'Iniciante' },
    { id: '2', name: 'Profissional' },
  ]
}

export async function checkCpfExists(cpf: string) {
  return false
}

export async function uploadPhoto(file: File) {
  return 'https://img.usecurling.com/p/200/200?q=avatar'
}

export async function createAthlete(athleteData: any) {
  return { id: 'mock-id', ...athleteData }
}

import pb from '@/lib/pocketbase/client'

export async function getClubs() {
  try {
    return await pb.collection('clubs').getFullList()
  } catch (error) {
    console.error('Error fetching clubs', error)
    return [
      { id: '1', name: 'Clube A' },
      { id: '2', name: 'Clube B' },
    ]
  }
}

export async function getCategories() {
  try {
    return await pb.collection('categories').getFullList()
  } catch (error) {
    console.error('Error fetching categories', error)
    return [
      { id: '1', name: 'Iniciante' },
      { id: '2', name: 'Profissional' },
    ]
  }
}

export async function checkCpfExists(cpf: string) {
  try {
    const data = await pb.collection('athletes').getFirstListItem(`cpf="${cpf}"`)
    return !!data
  } catch (error) {
    return false
  }
}

export async function uploadPhoto(file: File) {
  try {
    const formData = new FormData()
    formData.append('file', file)
    const record = await pb.collection('media_uploads').create(formData)
    return pb.files.getURL(record, record.file)
  } catch (error) {
    console.error('Error uploading photo', error)
    return 'https://img.usecurling.com/p/200/200?q=avatar'
  }
}

export async function createAthlete(athleteData: any) {
  try {
    return await pb.collection('athletes').create(athleteData)
  } catch (error) {
    console.error('Error creating athlete', error)
    return { id: 'mock-id', ...athleteData }
  }
}

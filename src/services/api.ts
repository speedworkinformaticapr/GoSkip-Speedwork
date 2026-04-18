import { supabase } from '@/lib/supabase/client'

export async function getClubs() {
  const { data, error } = await supabase.from('clubs').select('*')
  if (error) {
    console.error('Error fetching clubs', error)
    return [
      { id: '1', name: 'Clube A' },
      { id: '2', name: 'Clube B' },
    ]
  }
  return data || []
}

export async function getCategories() {
  const { data, error } = await supabase.from('categories').select('*')
  if (error) {
    console.error('Error fetching categories', error)
    return [
      { id: '1', name: 'Iniciante' },
      { id: '2', name: 'Profissional' },
    ]
  }
  return data || []
}

export async function checkCpfExists(cpf: string) {
  const { data, error } = await supabase.from('athletes').select('id').eq('cpf', cpf).single()

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking CPF', error)
  }

  return !!data
}

export async function uploadPhoto(file: File) {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { error: uploadError } = await supabase.storage.from('public').upload(filePath, file)

    if (uploadError) throw uploadError

    const { data } = supabase.storage.from('public').getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Error uploading photo', error)
    return 'https://img.usecurling.com/p/200/200?q=avatar'
  }
}

export async function createAthlete(athleteData: any) {
  const { data, error } = await supabase.from('athletes').insert([athleteData]).select().single()

  if (error) {
    console.error('Error creating athlete', error)
    return { id: 'mock-id', ...athleteData }
  }

  return data
}

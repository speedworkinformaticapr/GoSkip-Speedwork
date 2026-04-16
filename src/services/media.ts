import { supabase } from '@/lib/supabase/client'

export interface MediaItem {
  id: string
  file_name: string
  url: string
  type: string
  title?: string
  description?: string
  tags?: string[]
  created_at: string
}

const BUCKET = 'media'

export const getMedia = async (typePrefix?: string): Promise<MediaItem[]> => {
  let query = supabase.from('media_items').select('*').order('created_at', { ascending: false })

  if (typePrefix) {
    query = query.like('type', `${typePrefix}%`)
  }

  const { data, error } = await query
  if (error) throw error
  return data as MediaItem[]
}

export const uploadMedia = async (file: File, metadata: Partial<MediaItem>): Promise<MediaItem> => {
  const dateStr = new Date().toISOString().replace(/\D/g, '').slice(0, 14)
  const prefix = file.type.startsWith('image')
    ? 'img'
    : file.type.startsWith('video')
      ? 'video'
      : file.type.startsWith('audio')
        ? 'audio'
        : 'doc'
  const ext = file.name.split('.').pop()
  const fileName = `${prefix}-${dateStr}.${ext}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from(BUCKET)
    .upload(fileName, file, { cacheControl: '3600', upsert: false })

  if (storageError) throw storageError

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storageData.path)

  const { data: dbData, error: dbError } = await supabase
    .from('media_items')
    .insert({
      file_name: fileName,
      url: urlData.publicUrl,
      type: file.type,
      title: metadata.title || fileName,
      description: metadata.description || '',
      tags: metadata.tags || [],
    })
    .select()
    .single()

  if (dbError) throw dbError
  return dbData as MediaItem
}

export const updateMedia = async (id: string, updates: Partial<MediaItem>): Promise<void> => {
  const { error } = await supabase.from('media_items').update(updates).eq('id', id)
  if (error) throw error
}

export const deleteMedia = async (id: string, fileName: string): Promise<void> => {
  await supabase.storage.from(BUCKET).remove([fileName])
  const { error } = await supabase.from('media_items').delete().eq('id', id)
  if (error) throw error
}

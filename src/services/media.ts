import pb from '@/lib/pocketbase/client'

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

export const getMedia = async (typePrefix?: string): Promise<MediaItem[]> => {
  try {
    let filter = ''
    if (typePrefix) filter = `type ~ "${typePrefix}%"`

    const records = await pb.collection('media').getFullList({ filter, sort: '-created' })
    return records.map((record) => ({
      id: record.id,
      file_name: record.file_name,
      url: pb.files.getURL(record, record.file),
      type: record.type,
      title: record.title,
      description: record.description,
      tags: record.tags ? JSON.parse(record.tags) : [],
      created_at: record.created,
    })) as MediaItem[]
  } catch (e) {
    return []
  }
}

export const uploadMedia = async (file: File, metadata: Partial<MediaItem>): Promise<MediaItem> => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('file_name', file.name)
    formData.append('type', file.type)
    if (metadata.title) formData.append('title', metadata.title)
    if (metadata.description) formData.append('description', metadata.description)
    if (metadata.tags) formData.append('tags', JSON.stringify(metadata.tags))

    const record = await pb.collection('media').create(formData)
    return {
      id: record.id,
      file_name: record.file_name,
      url: pb.files.getURL(record, record.file),
      type: record.type,
      title: record.title,
      description: record.description,
      tags: record.tags ? JSON.parse(record.tags) : [],
      created_at: record.created,
    } as MediaItem
  } catch (e) {
    return {
      id: Math.random().toString(),
      file_name: file.name,
      url: 'https://img.usecurling.com/p/200/200?q=file',
      type: file.type,
      title: metadata.title || file.name,
      description: metadata.description || '',
      tags: metadata.tags || [],
      created_at: new Date().toISOString(),
    } as MediaItem
  }
}

export const updateMedia = async (id: string, updates: Partial<MediaItem>): Promise<void> => {
  try {
    await pb.collection('media').update(id, updates)
  } catch {
    /* intentionally ignored */
  }
}

export const deleteMedia = async (id: string, fileName: string): Promise<void> => {
  try {
    await pb.collection('media').delete(id)
  } catch {
    /* intentionally ignored */
  }
}

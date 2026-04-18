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
  return []
}

export const uploadMedia = async (file: File, metadata: Partial<MediaItem>): Promise<MediaItem> => {
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

export const updateMedia = async (id: string, updates: Partial<MediaItem>): Promise<void> => {}

export const deleteMedia = async (id: string, fileName: string): Promise<void> => {}

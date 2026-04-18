export type EventData = any
export type PhotoRow = any
export type PhotoWithEvent = any

export async function getGalleryPhotos(filters?: { eventId?: string; category?: string }) {
  return [
    {
      id: '1',
      event_id: '1',
      photo_url: 'https://img.usecurling.com/p/400/300?q=gallery',
      uploaded_at: new Date().toISOString(),
      events: { id: '1', name: 'Mock Event', date: new Date().toISOString() },
    },
  ] as PhotoWithEvent[]
}

export async function uploadGalleryPhotos(
  eventId: string,
  files: File[],
  onProgress?: (current: number, total: number) => void,
) {
  if (onProgress) onProgress(files.length, files.length)
  return files.map((f, i) => ({
    id: `photo-${i}`,
    event_id: eventId,
    photo_url: 'https://img.usecurling.com/p/400/300?q=uploaded',
    uploaded_at: new Date().toISOString(),
  }))
}

export async function createGalleryEvent(eventData: Partial<EventData>) {
  return { id: 'new-event-id', ...eventData }
}

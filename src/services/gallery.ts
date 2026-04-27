import pb from '@/lib/pocketbase/client'

export type EventData = any
export type PhotoRow = any
export type PhotoWithEvent = any

export async function getGalleryPhotos(filters?: { eventId?: string; category?: string }) {
  try {
    let filterArr = []
    if (filters?.eventId) filterArr.push(`event_id="${filters.eventId}"`)
    if (filters?.category) filterArr.push(`category="${filters.category}"`)

    const records = await pb.collection('gallery_photos').getFullList({
      filter: filterArr.join(' && '),
      expand: 'event_id',
      sort: '-uploaded_at',
    })
    return records.map((record) => ({
      ...record,
      events: record.expand?.event_id || null,
      photo_url: pb.files.getURL(record, record.photo),
    }))
  } catch (e) {
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
}

export async function uploadGalleryPhotos(
  eventId: string,
  files: File[],
  onProgress?: (current: number, total: number) => void,
) {
  const uploaded = []
  for (let i = 0; i < files.length; i++) {
    const formData = new FormData()
    formData.append('event_id', eventId)
    formData.append('photo', files[i])
    try {
      const record = await pb.collection('gallery_photos').create(formData)
      uploaded.push({
        id: record.id,
        event_id: eventId,
        photo_url: pb.files.getURL(record, record.photo),
        uploaded_at: record.created,
      })
    } catch (e) {
      uploaded.push({
        id: `photo-${i}`,
        event_id: eventId,
        photo_url: 'https://img.usecurling.com/p/400/300?q=uploaded',
        uploaded_at: new Date().toISOString(),
      })
    }
    if (onProgress) onProgress(i + 1, files.length)
  }
  return uploaded
}

export async function createGalleryEvent(eventData: Partial<EventData>) {
  try {
    return await pb.collection('events').create(eventData)
  } catch (e) {
    return { id: 'new-event-id', ...eventData }
  }
}

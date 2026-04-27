import { create } from 'zustand'
import pb from '@/lib/pocketbase/client'

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: string
  is_read: boolean
  created: string
}

interface NotificationStore {
  notifications: Notification[]
  unreadCount: number
  fetchNotifications: (userId: string) => Promise<void>
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: (userId: string) => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  addNotification: (notification: Notification) => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async (userId) => {
    try {
      const data = await pb.collection('notifications').getList(1, 50, {
        filter: `user_id = "${userId}"`,
        sort: '-created',
      })

      set({
        notifications: data.items as any as Notification[],
        unreadCount: data.items.filter((n: any) => !n.is_read).length,
      })
    } catch (e) {
      console.error(e)
    }
  },

  markAsRead: async (id) => {
    try {
      await pb.collection('notifications').update(id, { is_read: true })
      set((state) => {
        const updated = state.notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        return {
          notifications: updated,
          unreadCount: updated.filter((n) => !n.is_read).length,
        }
      })
    } catch (e) {
      console.error(e)
    }
  },

  markAllAsRead: async (userId) => {
    try {
      const unread = get().notifications.filter((n) => !n.is_read)
      await Promise.all(
        unread.map((n) => pb.collection('notifications').update(n.id, { is_read: true })),
      )
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }))
    } catch (e) {
      console.error(e)
    }
  },

  deleteNotification: async (id) => {
    try {
      await pb.collection('notifications').delete(id)
      set((state) => {
        const filtered = state.notifications.filter((n) => n.id !== id)
        return {
          notifications: filtered,
          unreadCount: filtered.filter((n) => !n.is_read).length,
        }
      })
    } catch (e) {
      console.error(e)
    }
  },

  addNotification: (notification) => {
    set((state) => {
      if (state.notifications.some((n) => n.id === notification.id)) return state
      const newNotifs = [notification, ...state.notifications].slice(0, 50)
      return {
        notifications: newNotifs,
        unreadCount: newNotifs.filter((n) => !n.is_read).length,
      }
    })
  },
}))

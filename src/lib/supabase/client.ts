import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || ''

const createDummyClient = (): any => {
  const proxy: any = new Proxy(function () {}, {
    get: (_, prop) => {
      if (prop === 'then') {
        return (resolve: any) => resolve({ data: null, error: null })
      }
      if (prop === 'auth') {
        return {
          getSession: async () => ({ data: { session: null }, error: null }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signUp: async () => ({ data: null, error: { message: 'Supabase not connected' } }),
          signInWithPassword: async () => ({
            data: null,
            error: { message: 'Supabase not connected' },
          }),
          signOut: async () => ({ error: null }),
        }
      }
      if (prop === 'channel') {
        const dummyChannel = {
          on: () => dummyChannel,
          subscribe: () => dummyChannel,
          unsubscribe: () => {},
        }
        return () => dummyChannel
      }
      if (prop === 'removeChannel') {
        return () => {}
      }
      if (prop === 'storage') {
        return {
          from: () => ({
            upload: async () => ({ data: null, error: { message: 'Supabase not connected' } }),
            getPublicUrl: () => ({ data: { publicUrl: '' } }),
          }),
        }
      }
      return proxy
    },
    apply: () => proxy,
  })
  return proxy
}

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : createDummyClient()

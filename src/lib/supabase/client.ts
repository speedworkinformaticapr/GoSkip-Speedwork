// Dummy supabase client for migration to PocketBase
export const supabase = {
  from: (table: string) => ({
    select: (fields?: string) => ({
      eq: (field: string, value: any) => ({
        single: async () => ({ data: null, error: { message: 'Supabase is deprecated' } }),
        order: async () => ({ data: [], error: null }),
      }),
      order: async () => ({ data: [], error: null }),
      insert: async (payload: any) => ({
        data: null,
        error: { message: 'Supabase is deprecated' },
      }),
    }),
    insert: async (payload: any) => ({ data: null, error: { message: 'Supabase is deprecated' } }),
    update: (payload: any) => ({
      eq: async (field: string, value: any) => ({
        data: null,
        error: { message: 'Supabase is deprecated' },
      }),
    }),
    delete: () => ({
      eq: async (field: string, value: any) => ({
        data: null,
        error: { message: 'Supabase is deprecated' },
      }),
    }),
  }),
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signOut: async () => ({ error: null }),
    signUp: async () => ({ data: null, error: { message: 'Supabase is deprecated' } }),
    signInWithPassword: async () => ({ data: null, error: { message: 'Supabase is deprecated' } }),
    resetPasswordForEmail: async () => ({ error: { message: 'Supabase is deprecated' } }),
    updateUser: async () => ({ data: null, error: { message: 'Supabase is deprecated' } }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: async (path: string, file: any) => ({
        data: null,
        error: { message: 'Supabase is deprecated' },
      }),
      getPublicUrl: (path: string) => ({ data: { publicUrl: '' } }),
      remove: async (paths: string[]) => ({
        data: null,
        error: { message: 'Supabase is deprecated' },
      }),
    }),
  },
}

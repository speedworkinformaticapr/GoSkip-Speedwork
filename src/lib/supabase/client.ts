// Mocked Supabase client to prevent connection attempts and runtime errors
const createDeepProxy = (): any => {
  const proxy = new Proxy(() => proxy, {
    get: (_, prop) => {
      if (prop === 'then') return undefined // Promise chaining safety
      if (prop === 'auth') {
        return {
          getSession: async () => ({ data: { session: null } }),
          onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
          signUp: async () => ({ data: null, error: null }),
          signInWithPassword: async () => ({ data: null, error: null }),
          signOut: async () => ({ error: null }),
        }
      }
      return proxy
    },
    apply: () => proxy,
  })
  return proxy
}

export const supabase = createDeepProxy()

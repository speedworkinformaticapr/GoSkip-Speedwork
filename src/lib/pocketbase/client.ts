// Mocked Pocketbase client to prevent connection attempts and runtime errors
const createDeepProxy = (): any => {
  const proxy = new Proxy(() => proxy, {
    get: (_, prop) => {
      if (prop === 'then') return undefined // Promise chaining safety
      if (prop === 'authStore') {
        return {
          record: null,
          onChange: () => () => {},
          clear: () => {},
        }
      }
      return proxy
    },
    apply: () => proxy,
  })
  return proxy
}

const pb = createDeepProxy()
export default pb

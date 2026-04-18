/**
 * Mocked hook for real-time subscriptions.
 * Does nothing to prevent background connection errors.
 */
export function useRealtime(
  collectionName: string,
  callback: (data: any) => void,
  enabled: boolean = true,
) {
  // Empty hook implementation
}

export default useRealtime

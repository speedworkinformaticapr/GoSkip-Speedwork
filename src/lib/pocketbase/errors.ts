export type FieldErrors = Record<string, string>

export function extractFieldErrors(error: unknown): FieldErrors {
  return {}
}

export function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'An unexpected error occurred.'
}

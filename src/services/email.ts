import pb from '@/lib/pocketbase/client'

export const sendWelcomeEmail = async (email: string, name: string) => {
  return { success: true }
}

export const sendEventRegistrationEmail = async (
  email: string,
  name: string,
  eventDetails: any,
) => {
  return { success: true }
}

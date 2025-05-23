import prisma from '@/lib/db';

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await prisma.twoFactorConfirmation.findUnique({
      where: { userId}
    })

    return twoFactorConfirmation
  } catch {
    return null
  }
}
import prisma from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    await prisma.$connect();
    const user = await prisma.user.findFirst({
      where: { email },
    });

    return user;
  } catch {
    return null;
  } finally {
    await prisma.$disconnect();
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};
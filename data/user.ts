import { db } from "@/lib/db";

export const getUserByUsername = async (email: string) => {
  try {
    const user = await db.users.findFirst({
      where: { email },
    });

    return user;
  } catch {
    return null;
  }
}

export const getUserById = async (id: string) => {
  try {
    const user = await db.users.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
};
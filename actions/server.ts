"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { UserRole } from "@prisma/client";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  password: string | null;
  role: UserRole;
}

interface UserResponse {
  user: User | null;
  uid: string | undefined;
  error?: string;
}

export async function getCurrentUser(): Promise<UserResponse> {
  try {
    await prisma.$connect();

    const session = await auth();
    const user = await prisma.user.findFirst({
      where: {
        email: session?.user?.email as string,
      },
    });

    const uid = user?.id;
    return { user, uid };
  } catch (error) {
    await prisma.$disconnect();
    return { user: null, uid: undefined, error: "Error fetching user!" };
  } finally {
    await prisma.$disconnect();
  }
}
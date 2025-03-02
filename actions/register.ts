"use server";

import * as z from "zod";
import bcrypt from "bcrypt";
import { RegisterSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByUsername } from "@/data/user";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { username, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByUsername(username);

  if (existingUser) {
    return { error: "Username already exists!" };
  }

  await db.users.create({
    data: {
      username,
      password: hashedPassword,
      name,
    },
  });

  // TODO: Send verif token email

  return { success: "User created!" };
};

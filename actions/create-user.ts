"use server";

import * as z from "zod";
import bcrypt from "bcrypt";
import { AddUserSchema } from "@/schemas";
import prisma from "@/lib/db";
import { getUserByEmail } from "@/data/user";

export const createUser = async (values: z.infer<typeof AddUserSchema>) => {
  const validatedFields = AddUserSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { email, password, name, role, image, signature } =
    validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: "Email already exists!" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  let imageBuffer: Buffer | null = null;
  let signatureBuffer: Buffer | null = null;

  if (image) {
    const arrayBuffer = await image.arrayBuffer();
    imageBuffer = Buffer.from(arrayBuffer);
  }

  if (signature) {
    const arrayBuffer = await signature.arrayBuffer();
    signatureBuffer = Buffer.from(arrayBuffer);
  }

  try {
    const data = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        image: imageBuffer || undefined,
        signature: signatureBuffer || undefined,
      },
    });

    return { success: "User created successfully!" };
  } catch (error) {
    console.error("Error creating user: ", error);
    return { error: "Failed to create user!" };
  }
};

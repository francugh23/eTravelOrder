"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import { TravelFormSchema } from "@/schemas";
import { getCurrentUser } from "./server";

export const createTravelOrder = async (
  values: z.infer<typeof TravelFormSchema>
) => {
  const generateCode = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);

    const randomLetters = Array.from({ length: 2 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    ).join("");

    const code = `TO-${day}-${month}-${year}-${randomLetters}`;

    return code;
  };

  const validatedFields = TravelFormSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const {
    purpose,
    host,
    inclusiveDates,
    destination,
    fundSource,
    attachedFile,
    additionalParticipants,
  } = validatedFields.data;

  const user = await getCurrentUser();

  try {
    await prisma.travelOrder.create({
      data: {
        code: generateCode(),
        userId: user?.user?.id as string,
        purpose: purpose,
        host: host,
        inclusiveDates: inclusiveDates,
        destination: destination,
        fundSource: fundSource,
        attachedFile: attachedFile as string,
        additionalParticipants: additionalParticipants || "",
      },
    });

    return { success: "Travel order submitted!" };
  } catch (error) {
    return { error: "Failed to submit travel order!" };
  }
};

export const fetchTravelOrdersById = async (userId: string) => {
  try {
    await prisma.$connect;

    const res = await prisma.travelOrder.findMany({
      where: {
        userId: userId,
      },
    });

    return res;
  } catch {
    return [];
  } finally {
    await prisma.$disconnect;
  }
};

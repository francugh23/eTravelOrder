"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import { TravelFormSchema } from "@/schemas";
import { getCurrentUser } from "./server";

export const createTravelOrder = async (
  values: z.infer<typeof TravelFormSchema>
) => {
  const generateCode = async () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear()).slice(-2);

    const randomLetters = Array.from({ length: 2 }, () =>
      String.fromCharCode(Math.floor(Math.random() * 26) + 65)
    ).join("");

    const randomNumbers = String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    );

    const code = `TO-${day}${month}${year}-${randomLetters}${randomNumbers}`;

    const existingTravelOrderCode = await prisma.travelOrder.findUnique({
      where: { code: code},
    });

    if (existingTravelOrderCode) {
      return generateCode();
    }

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
        code: await generateCode(),
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

    return { success: "Travel order request submitted!" };
  } catch (error) {
    return { error: "Failed to submit travel order request!" };
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

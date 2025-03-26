"use server";

import * as z from "zod";
import prisma from "@/lib/db";
import { TravelFormSchema } from "@/schemas";
import { getCurrentUser } from "./server";

export const createTravelOrder = async (values: z.infer<typeof TravelFormSchema>) => {
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
        userId: user?.user?.id as string,
        purpose: purpose,
        host: host,
        inclusiveDates: inclusiveDates,
        destination: destination,
        fundSource: fundSource,
        attachedFile: attachedFile,
        additionalParticipants: additionalParticipants || "",
      },
    });

    return { success: "Travel order submitted!" };
  } catch (error) {
    return { error: "Failed to submit travel order!" };
  }
};

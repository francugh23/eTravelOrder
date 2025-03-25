"use server"

import prisma from "@/lib/db";

export async function fetchStations() {
  try {
    await prisma.$connect();

    const stations = await prisma.station.findMany();

    return stations;
  } catch (e) {
    return { error: "Failed to retrieve stations!" };
  } finally {
    await prisma.$disconnect();
  }
}

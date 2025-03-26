"use server";

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

export async function fetchStationById(id: string) {
  try {
    await prisma.$connect();

    const data = await prisma.station.findUnique({
      where: { id: id },
      select: {
        office: true,
        unit: true,
      }
    });

    return data;
  } catch (e) {
    return { error: "Failed to retrieve station!" };
  } finally {
    await prisma.$disconnect();
  }
}

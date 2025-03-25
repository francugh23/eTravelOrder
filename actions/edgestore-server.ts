import { UserRole } from "@prisma/client";
import { initEdgeStore } from "@edgestore/server";
import {
  CreateContextOptions,
  createEdgeStoreNextHandler,
} from "@edgestore/server/adapters/next/app";
import { z } from "zod";
import { getCurrentUser } from "@/actions/server"; 

type Context = {
  userId: string;
  role: UserRole;
};

async function createContext(): Promise<Context> {
  const user = await getCurrentUser();

  return {
    userId: user.uid as string,
    role: user.user?.role as UserRole,
  };
}

const es = initEdgeStore.context<Context>().create();

export const edgeStoreRouter = es.router({
  myPublicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 1, // 1MB
      accept: ["image/png", "image/jpeg"],
    })
    .input(
      z.object({
        type: z.enum(Object.values(UserRole) as [UserRole, ...UserRole[]]),
      })
    )
    .path(({ input }) => [{ type: input.type }]),

  myProtectedFiles: es
    .fileBucket()
    .path(({ ctx }) => [{ owner: ctx.userId }])
    .accessControl({
      OR: [
        {
          userId: { path: "owner" },
        },
        {
          role: { eq: UserRole.ADMIN },
        },
      ],
    }),
});

export type EdgeStoreRouter = typeof edgeStoreRouter;

export const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  createContext,
});
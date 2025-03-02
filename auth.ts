import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import authConfig from "./auth.config";
import { db } from "./lib/db";


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt"},
  ...authConfig,
});

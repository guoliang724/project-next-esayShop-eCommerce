/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/prisma/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";
import { NextResponse } from "next/server";

export const config = {
  pages: {
    signIn: "/sign-in",
    signOut: "/sign-out",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (credentials == null) return null;

        const user = await prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });

        if (user && user.password) {
          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (isMatch) return user;
        } else return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, user, trigger, token }: any) {
      session.user.id = token.sub;
      session.user.role = token.role;
      session.user.name = token.name;

      if (trigger === "update") {
        session.user.name = user.name;
      }

      return session;
    },
    async jwt({ token, user, account, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;

        if (user?.name === "NO_NAME") {
          token.name = user.email!.split("@")[0];

          await prisma.user.update({
            where: { id: user.id },
            data: {
              name: token.name,
            },
          });
        }

        if (trigger == "signIn" || trigger === "signUp") {
          const cookiesObject = await cookies();
          const sessionCartId = cookiesObject.get("sessionCartId")?.value;

          if (sessionCartId) {
            const sessionCart = await prisma.cart.findFirst({
              where: { sessionCartId: sessionCartId },
            });

            console.log("sessionCart", sessionCart);

            if (sessionCart) {
              await prisma.cart.deleteMany({
                where: { userId: user.id },
              });

              await prisma.cart.update({
                where: { id: sessionCart.id },
                data: {
                  userId: user.id,
                },
              });
            }
          }
        }
      }

      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
    authorized({ request }) {
      if (!request.cookies.get("sessionCartId")) {
        const sessionCartId = crypto.randomUUID();
        const newRequestHeaders = new Headers(request.headers);

        const respose = NextResponse.next({
          request: {
            headers: newRequestHeaders,
          },
        });

        respose.cookies.set("sessionCartId", sessionCartId);

        return respose;
      } else return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, signIn, signOut, auth } = NextAuth(config);

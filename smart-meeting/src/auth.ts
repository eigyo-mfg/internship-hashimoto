import NextAuth, { Session } from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { User } from "@/app/types/user";
import { passwordMatch } from "@/app/lib/utils/hash";
import { getUser } from "@/app/lib/data";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      password: string;
    };
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        id: { type: "text" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        console.log("Authorize function called"); // デバッグ用のログ
        const parsedCredentials = z
          .object({
            id: z.string(),
            password: z.string(),
          })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          let id: string;
          let password: string;
          if (credentials) {
            id = credentials.id as string;
            password = credentials.password as string;
          } else {
            console.log("No credentials");
            return null;
          }
          //console.log('Credentials')
          const user = await getUser(id);
          if (!user) {
            return null;
          }
          const isPasswordMatched = passwordMatch(
            password,
            user.password as string,
          );
          //const passwordsMatch = await bcrypt.compare(password, user.password);
          if (isPasswordMatched) {
            console.log("User authenticated successfully"); // デバッグ用のログ
            return user;
          }
          console.log("User authentication failed"); // デバッグ用のログ
          return null;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.name = user.name;
        token.sub = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      console.log("Session callback called"); // デバッグ用のログ
      if (token) {
        if (session.user) {
          session.user.name = token.name;
          session.user.id = token.sub as string;
        }
      }
      return session;
    },
  },
});

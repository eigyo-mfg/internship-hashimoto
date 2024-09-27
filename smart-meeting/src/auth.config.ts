import { NextAuthOptions, Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
import Credentials from "next-auth/providers/credentials";
import { getUser } from "@/app/lib/data";
import { passwordMatch } from "@/app/lib/utils/hash";
import { z } from "zod";

export const authOptions:NextAuthOptions = {
  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
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
            return { id: user.id, privilege: user.privilege, name: user.firstName + " " + user.lastName };
          }
          console.log("passwords doesn't match"); // デバッグ用のログ
          return null;
        }
        console.log("Invalid credentials");
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      console.log(user)
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (user) {
        token.id = user.id;
      }
      return token
    },
    async session({ session,token }: { session: Session; token: any; user: any }) {
      if(session?.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },

} 
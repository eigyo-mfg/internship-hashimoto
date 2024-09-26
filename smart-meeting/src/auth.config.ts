import type  NextAuthOptions from "next-auth";

export const authConfig = {
  // https://next-auth.js.org/configuration/providers
  pages: {
    signIn: "/login",
  },
  providers: [],
} ;

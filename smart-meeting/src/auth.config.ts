import { NextAuthOptions, Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getPassword, getUser } from "@/app/lib/data";
import { passwordMatch } from "@/app/lib/utils/hash";
import { z } from "zod";

// セッションの型を拡張する
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

// 認証オプションを定義する
export const authOptions: NextAuthOptions = {
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

          // パースに失敗した場合はエラーを出力してnullを返す
        if (!parsedCredentials.success) {
          console.log("Invalid credentials");
          return null;
        }

        // パースに成功した場合は認証処理を行う
          let id: number;
          let password: string;

          if (credentials) {
            id = parseInt(credentials.id as string);
            password = credentials.password as string;
          } else {
            console.log("No credentials");
            return null;
          }

        // ユーザーが存在するか確認する
          const hashedPassword = await getPassword(id);
          if (!hashedPassword) {
            return null;
          }
          // パスワードが一致するか確認する
          const isPasswordMatched = passwordMatch(password, hashedPassword);
          if (isPasswordMatched) {
            console.log("User authenticated successfully"); // デバッグ用のログ
            return { id: credentials.id };
          }
          console.log("passwords doesn't match"); // デバッグ用のログ
          return null;
        },
    }),
  ],
  callbacks: {
    async jwt({ token, user, profile }) {
      // ユーザー情報が存在する場合はトークンに追加する
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // セッション情報を追加する
    async session({
      session,
      token,
    }: {
      session: Session;
      token: any;
      user: any;
    }) {
      if (session?.user) {
        session.user.id = parseInt(token.id).toString();
      }
      return session;
    },
  },
};

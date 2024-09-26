'use server'

import { signIn } from "@/auth";

type status = "success" | "error";

export async function login(userId: string, password: string) {
  try {
    console.log("Logging in with user ID:", userId);
    const result = await signIn("credentials", {
      redirect: false,
      id: userId,
      password: password,
    });

    if (result?.error) {
      throw new Error(result.error);
    }

    return "success" as status;
  } catch (error) {
    console.error("Login error:", error);
    return "error" as status;
  }
}
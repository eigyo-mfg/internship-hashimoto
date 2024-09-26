import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

export async function middleware(request: NextRequest) {
  console.log("Middleware called"); // デバッグ用のログ

  const session = await auth();
  const path = request.nextUrl.pathname;
  const baseUrl = request.nextUrl.origin;
  const isOrdinalPath = request.nextUrl.pathname.search(/\./) == -1;

  if (!isOrdinalPath) {
    return NextResponse.next();
  }

  if (path === "/login" && session) {
    console.log("User is already logged in, redirecting to home"); // デバッグ用のログ
    return NextResponse.redirect(new URL("/", baseUrl));
  } else if (path !== "/login" && !session) {
    console.log("User is not logged in, redirecting to login"); // デバッグ用のログ
    return NextResponse.redirect(new URL("/login", baseUrl));
  } else {
    return NextResponse.next();
  }
}
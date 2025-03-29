import { NextResponse } from "next/server";

export function middleware(req) {
  if (req.nextUrl.pathname === "/error") {
    return NextResponse.redirect(new URL("/home", req.url));
  }
  return NextResponse.next();
}

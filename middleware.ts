/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((request): any => {
  const protectedPaths = [
    /\/shipping-address/,
    /\/payment-method/,
    /\/place-order/,
    /\/profile/,
    /\/user\/(.*)/,
    /\/order\/(.*)/,
    /\/admin/,
  ];

  const { pathname } = request.nextUrl;
  const isLoggedIn = !!request.auth;

  if (!isLoggedIn && protectedPaths.some((p) => p.test(pathname)))
    return Response.redirect(new URL("/sign-in", request.nextUrl));

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
  } else return null;
});

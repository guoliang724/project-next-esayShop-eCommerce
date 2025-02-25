import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((request): any => {
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

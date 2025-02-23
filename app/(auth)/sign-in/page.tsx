import React from "react";
import CredentialsSignForm from "./credentials-sign-form";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata:Metadata = {
  title: "Sign In",
  description: "Sign In Form",
};

async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>;
}) {
  const { callbackUrl } = await searchParams;

  const session = await auth();
  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div>
      <CredentialsSignForm />
    </div>
  );
}

export default SignInPage;

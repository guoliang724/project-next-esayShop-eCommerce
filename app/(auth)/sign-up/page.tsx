import React from "react";
import SignUpForm from "./sign-up-form";
import type { Metadata } from "next";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign Up Form",
};

async function SignUpPage({
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
      <SignUpForm />
    </div>
  );
}

export default SignUpPage;

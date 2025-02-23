import React from "react";
import SignUpForm from "./sign-up-form";
import { Metadata } from "next";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metedata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl: string }>;
}) => {
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
};

export default SignUpPage;

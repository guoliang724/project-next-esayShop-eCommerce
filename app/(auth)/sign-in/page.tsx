import React from "react";
import CredentialsSignForm from "./credentials-sign-form";
import { Metadata } from "next";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metedata: Metadata = {
  title: "Sign In",
};

const SignInPage = async ({
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
      <CredentialsSignForm />
    </div>
  );
};

export default SignInPage;

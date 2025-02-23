"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signInFormSchema, signUpFormSchema } from "../validator";
import { signIn, signOut } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/prisma/prisma";
import { error } from "console";
import { formatError } from "../utils";

export const SignInWithCredentials = async (
  prev: { message: string; success: boolean },
  formData: FormData
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    console.log("signwi", user.email);
    console.log("signwi", user.password);

    await signIn("credentials", user);

    return { success: true, message: "Sign in successful" };
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }

    return { success: false, message: "Invalid email or password" };
  }
};

export const signOutUser = async () => {
  await signOut();
};

export const signUpUser = async (
  prev: { message: string; success: boolean },
  formData: FormData
) => {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = user.password;
    const hashPassword = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: hashPassword,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User register successsully" };
  } catch (e) {
    if (isRedirectError(e)) {
      throw e;
    }
    return { success: false, message: formatError(e) };
  }
};

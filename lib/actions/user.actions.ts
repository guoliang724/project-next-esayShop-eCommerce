"use server";

import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  signInFormSchema,
  signUpFormSchema,
  shippingAddressSchema,
} from "../validator";
import { signIn, signOut, auth } from "@/auth";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/prisma/prisma";
import { formatError } from "../utils";
import { IShippingAddress } from "@/type";

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

export async function getUserById(userId: string) {
  const user = await prisma.user.findFirst({
    where: { id: userId },
  });

  if (!user) throw new Error("User not found");

  return user;
}

export async function updateUserAddress(data: IShippingAddress) {
  try {
    const session = await auth();
    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("User not found");

    const address = shippingAddressSchema.parse(data);
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        address: address,
      },
    });
    return {
      success: true,
      message: "User updated successfully",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

"use server";

import { getUserByUsername, updateUser } from "@/lib/api/user";
import { User } from "@/lib/db/schema";
import { parseFormData } from "@/lib/validators";
import { userSchema } from "@/lib/validators/user";

const ERROR = {
  default: "An error occurred, please try again.",
};

export async function updateDisplayName(
  userId: User["id"],
  prevState: unknown,
  formData: FormData
) {
  const parsedData = parseFormData(formData, userSchema.pick({ name: true }));
  if (!parsedData.success) {
    return { error: parsedData.error };
  }

  try {
    await updateUser(userId, parsedData.data);
    return { error: "" };
  } catch (error) {
    console.error(error);
    return { error: ERROR.default };
  }
}

export async function updateUsername(
  userId: User["id"],
  prevState: unknown,
  formData: FormData
) {
  const parsedData = parseFormData(
    formData,
    userSchema.pick({ username: true })
  );
  if (!parsedData.success) {
    return { error: parsedData.error };
  }

  try {
    const existingUser = await getUserByUsername(parsedData.data.username);
    if (existingUser && existingUser.id !== userId) {
      return { error: "Username is already taken." };
    }

    await updateUser(userId, parsedData.data);
    return { error: "" };
  } catch (error) {
    console.error(error);
    return { error: ERROR.default };
  }
}

import { z, ZodError } from "zod";

export type ZodSafeParse<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: string;
    };

export function parseFormData<T>(
  formData: FormData,
  schema: z.Schema<T>
): ZodSafeParse<T> {
  const raw = Object.fromEntries(formData.entries());
  const parsedData = schema.safeParse(raw);

  if (parsedData.success) {
    return {
      success: true,
      data: parsedData.data,
    };
  } else {
    const error: ZodError = parsedData.error;
    const errorMessage =
      error.issues[0]?.message || "An error occurred, please try again.";
    return {
      success: false,
      error: errorMessage,
    };
  }
}

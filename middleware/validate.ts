import { ZodType, z } from "zod";
import { AppError } from "@/middleware/error";

export async function validate<T>(
  schema: ZodType<T>,
  data: unknown
): Promise<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new AppError(400, `Invalid request: ${z.prettifyError(result.error)}`);
  }

  return result.data;
}

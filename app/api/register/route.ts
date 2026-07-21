import { z } from "zod";
import { NextResponse } from "next/server";
import { withErrorHandling, AppError } from "@/middleware/error";
import { validate } from "@/middleware/validate";
import { connectToDatabase } from "@/db/connection";
import { UserModel } from "@/db/models/user";
import { withUniqueSlug } from "@/lib/slug";
import { isDisposableEmail } from "@/lib/disposable-email";

const registerSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1).email(),
});

export const POST = withErrorHandling(async (request: Request) => {
  const { firstName, lastName, email } = await validate(
    registerSchema,
    await request.json()
  );

  if (isDisposableEmail(email)) {
    throw new AppError(400, "Disposable email addresses aren't allowed. Use a permanent email address.");
  }

  await connectToDatabase();
  await withUniqueSlug(`${firstName} ${lastName}`, (slug) =>
    UserModel.updateOne(
      { email },
      { $set: { firstName, lastName }, $setOnInsert: { email, role: "user", slug } },
      { upsert: true }
    )
  );

  return NextResponse.json({ ok: true });
});

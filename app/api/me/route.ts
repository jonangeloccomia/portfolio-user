import { z } from "zod";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/middleware/error";
import { validate } from "@/middleware/validate";
import { requireSession } from "@/middleware/auth";
import { connectToDatabase } from "@/db/connection";
import { UserModel } from "@/db/models/user";
import { mongoClientPromise } from "@/db/mongo-client";
import { clearSessionCookies } from "@/lib/session-cookies";

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  return NextResponse.json({ user: session.user });
});

const updateSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
});

export const PATCH = withErrorHandling(async (request: Request) => {
  const session = await requireSession();
  const { firstName, lastName } = await validate(
    updateSchema,
    await request.json()
  );

  await connectToDatabase();
  await UserModel.updateOne(
    { email: session.user.email },
    { $set: { firstName, lastName } }
  );

  return NextResponse.json({ ok: true });
});

export const DELETE = withErrorHandling(async () => {
  const session = await requireSession();
  const email = session.user.email;

  await connectToDatabase();
  await UserModel.deleteOne({ email });

  const client = await mongoClientPromise;
  const db = client.db();
  const authUser = await db.collection("users").findOne({ email });

  if (authUser) {
    await db.collection("accounts").deleteMany({ userId: authUser._id });
    await db.collection("sessions").deleteMany({ userId: authUser._id });
    await db.collection("users").deleteOne({ _id: authUser._id });
  }

  const response = NextResponse.json({ ok: true });
  clearSessionCookies(response);
  return response;
});

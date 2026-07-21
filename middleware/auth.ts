import { auth } from "@/config/auth";
import { AppError } from "@/middleware/error";
import { connectToDatabase } from "@/db/connection";
import { UserModel } from "@/db/models/user";

export async function requireSession() {
  const session = await auth();

  if (!session?.user) {
    throw new AppError(401, "Authentication required");
  }

  return session;
}

export async function requireUser() {
  const session = await requireSession();

  await connectToDatabase();
  const user = await UserModel.findOne({ email: session.user.email }).lean();

  if (!user) {
    throw new AppError(401, "Authentication required");
  }

  return user;
}

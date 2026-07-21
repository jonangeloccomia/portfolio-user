import { requireSession } from "@/middleware/auth";
import { AppError } from "@/middleware/error";

type Role = "user" | "admin";

export async function requireRole(...roles: Role[]) {
  const session = await requireSession();

  if (!roles.includes(session.user.role as Role)) {
    throw new AppError(403, "Insufficient permissions");
  }

  return session;
}

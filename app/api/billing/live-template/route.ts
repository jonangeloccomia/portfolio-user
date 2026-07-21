import { z } from "zod";
import { NextResponse } from "next/server";
import { withErrorHandling, AppError } from "@/middleware/error";
import { validate } from "@/middleware/validate";
import { requireUser } from "@/middleware/auth";
import { connectToDatabase } from "@/db/connection";
import { TemplateModel } from "@/db/models/template";
import { UserModel } from "@/db/models/user";

const switchSchema = z.object({ templateId: z.string().min(1) });

export const PATCH = withErrorHandling(async (request: Request) => {
  const user = await requireUser();
  const { templateId } = await validate(switchSchema, await request.json());

  await connectToDatabase();

  if (!user.liveExpiresAt || user.liveExpiresAt < new Date()) {
    throw new AppError(400, "No active live access to switch");
  }

  const template = await TemplateModel.findOne({
    _id: templateId,
    userId: user._id,
  }).lean();

  if (!template) {
    throw new AppError(404, "Template not found");
  }

  await UserModel.updateOne(
    { _id: user._id },
    { $set: { liveTemplateId: template._id } }
  );

  return NextResponse.json({ ok: true });
});

import { z } from "zod";
import { NextResponse } from "next/server";
import { withErrorHandling, AppError } from "@/middleware/error";
import { validate } from "@/middleware/validate";
import { requireUser } from "@/middleware/auth";
import { connectToDatabase } from "@/db/connection";
import { TemplateModel } from "@/db/models/template";

type Context = { params: Promise<{ id: string }> };

export const GET = withErrorHandling<Context>(async (_request, { params }) => {
  const user = await requireUser();
  const { id } = await params;

  await connectToDatabase();
  const template = await TemplateModel.findOne({
    _id: id,
    userId: user._id,
  }).lean();

  if (!template) {
    throw new AppError(404, "Template not found");
  }

  return NextResponse.json({ template });
});

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  content: z.string().optional(),
});

export const PATCH = withErrorHandling<Context>(async (request, { params }) => {
  const user = await requireUser();
  const { id } = await params;
  const updates = await validate(updateSchema, await request.json());

  await connectToDatabase();
  const template = await TemplateModel.findOneAndUpdate(
    { _id: id, userId: user._id },
    { $set: updates },
    { new: true }
  ).lean();

  if (!template) {
    throw new AppError(404, "Template not found");
  }

  return NextResponse.json({ template });
});

export const DELETE = withErrorHandling<Context>(async (_request, { params }) => {
  const user = await requireUser();
  const { id } = await params;

  await connectToDatabase();
  const result = await TemplateModel.deleteOne({
    _id: id,
    userId: user._id,
  });

  if (result.deletedCount === 0) {
    throw new AppError(404, "Template not found");
  }

  return NextResponse.json({ ok: true });
});

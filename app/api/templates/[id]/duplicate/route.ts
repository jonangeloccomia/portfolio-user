import { NextResponse } from "next/server";
import { withErrorHandling, AppError } from "@/middleware/error";
import { requireUser } from "@/middleware/auth";
import { connectToDatabase } from "@/db/connection";
import { TemplateModel } from "@/db/models/template";

type Context = { params: Promise<{ id: string }> };

export const POST = withErrorHandling<Context>(async (_request, { params }) => {
  const user = await requireUser();
  const { id } = await params;

  await connectToDatabase();
  const original = await TemplateModel.findOne({
    _id: id,
    userId: user._id,
  }).lean();

  if (!original) {
    throw new AppError(404, "Template not found");
  }

  const template = await TemplateModel.create({
    userId: original.userId,
    name: `${original.name} (Copy)`,
    content: original.content,
  });

  return NextResponse.json({ template }, { status: 201 });
});

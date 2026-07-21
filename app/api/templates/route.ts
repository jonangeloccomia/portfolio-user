import { z } from "zod";
import { NextResponse } from "next/server";
import { withErrorHandling } from "@/middleware/error";
import { validate } from "@/middleware/validate";
import { requireUser } from "@/middleware/auth";
import { connectToDatabase } from "@/db/connection";
import { TemplateModel } from "@/db/models/template";

export const GET = withErrorHandling(async () => {
  const user = await requireUser();

  await connectToDatabase();
  const templates = await TemplateModel.find({ userId: user._id })
    .sort({ updatedAt: -1 })
    .lean();

  return NextResponse.json({ templates });
});

const createSchema = z.object({
  name: z.string().min(1),
  content: z.string(),
});

export const POST = withErrorHandling(async (request: Request) => {
  const user = await requireUser();
  const { name, content } = await validate(createSchema, await request.json());

  await connectToDatabase();
  const template = await TemplateModel.create({
    userId: user._id,
    name,
    content,
  });

  return NextResponse.json({ template }, { status: 201 });
});

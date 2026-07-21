import { notFound } from "next/navigation";

import { requireUser } from "@/middleware/auth";
import { connectToDatabase } from "@/db/connection";
import { TemplateModel } from "@/db/models/template";
import BuilderNew from "@/components/dashboard/builder/new";

export default async function BuilderEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireUser();

  await connectToDatabase();

  const template = await TemplateModel.findOne({
    _id: id,
    userId: user._id,
  })
    .lean()
    .catch(() => null);

  if (!template) {
    notFound();
  }

  return (
    <BuilderNew
      templateId={id}
      initialName={template.name}
      initialContent={template.content}
    />
  );
}

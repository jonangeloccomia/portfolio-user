import { notFound } from "next/navigation";
import { connectToDatabase } from "@/db/connection";
import { UserModel } from "@/db/models/user";
import { TemplateModel } from "@/db/models/template";
import { LivePage } from "@/components/public/live-page";

export const dynamic = "force-dynamic";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectToDatabase();
  const user = await UserModel.findOne({ slug }).lean();

  if (!user) {
    notFound();
  }

  const isLive =
    !!user.liveTemplateId && !!user.liveExpiresAt && user.liveExpiresAt > new Date();

  const template = isLive
    ? await TemplateModel.findById(user.liveTemplateId).lean()
    : null;

  if (!template) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 text-center">
        <p className="text-muted-foreground">This page is currently unavailable.</p>
      </div>
    );
  }

  return <LivePage content={template.content} />;
}

import { z } from "zod";
import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { withErrorHandling, AppError } from "@/middleware/error";
import { validate } from "@/middleware/validate";
import { requireUser } from "@/middleware/auth";
import { connectToDatabase } from "@/db/connection";
import { TemplateModel } from "@/db/models/template";
import { UserModel } from "@/db/models/user";
import { env } from "@/config/env";
import { generatedPageSchema } from "@/lib/ai-template/schema";
import { buildCraftContent } from "@/lib/ai-template/builder";

const generateSchema = z.object({
  prompt: z.string().min(1).max(500),
});

export const DEFAULT_GENERATION_TOKENS = 7;

const SYSTEM_PROMPT = `You generate content for a landing page builder. The page is made of a small fixed library of section archetypes — you only provide content, never layout or styling code. A nav bar and footer are added automatically from the template name, so don't try to create them.

Archetypes:
- hero: the opening section. eyebrow (a short 1-4 word kicker label, "" for none) + headline + body + optional CTA button (buttonLabel: "" means no button) + optional image (withImage). The headline should be a value proposition, not just the brand name.
- feature_cards: 2-4 titled cards in a row, each with a short title + a 1-2 sentence body. Use this for benefits, features, or "how it works" — anything where each point needs its own words. Optional eyebrow + headline above the cards ("" for none).
- feature_grid: a strip of 3-5 images in a row (logos, screenshots, a gallery) with an optional headline above (headline: "" means no headline). There is no per-image text — reach for feature_cards instead whenever the points need words.
- content_split: an image beside an eyebrow + headline + body paragraph — used to explain one product/feature in depth (eyebrow: "" means none).
- cta_banner: the closing call-to-action band with an optional eyebrow + headline + body + a required button.

Eyebrows are rendered in uppercase automatically, so write them in normal sentence case (e.g. "Built for conversion", not "BUILT FOR CONVERSION").

Pick a "theme" per section from "light" | "brand" | "dark" | "warm" | "cool" | "bold" | "pastel" | "mono". "light"/"brand"/"dark" are the site's refreshed on-brand green/near-black palette; the rest are distinct moods (warm terracotta, cool slate-blue, bold navy/orange, soft pastel violet, neutral monochrome) — favor variety across the page and lean on whichever mood actually fits what the user described, not just the on-brand ones every time. Never reuse the same theme for every section, and alternate between lighter and darker sections so the page has visual rhythm.

Produce 3-5 sections that tell a coherent landing-page story for what the user describes: typically hero first, then a mix of feature_cards / feature_grid / content_split, then cta_banner last. Write real marketing copy specific to the user's prompt — no placeholder text like "Lorem ipsum" or "Your headline here".`;

export const POST = withErrorHandling(async (request: Request) => {
  const user = await requireUser();
  const { prompt } = await validate(generateSchema, await request.json());

  await connectToDatabase();
  const reserved = await UserModel.findOneAndUpdate(
    { _id: user._id, generationTokens: { $gt: 0 } },
    { $inc: { generationTokens: -1 } }
  );
  if (!reserved) {
    throw new AppError(
      429,
      "You've used all your AI generations. Build from a starter template or start from scratch instead."
    );
  }

  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });

  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
    output_config: { format: zodOutputFormat(generatedPageSchema) },
  });

  if (!response.parsed_output) {
    throw new AppError(502, "Generation failed — the model didn't return a valid page. Try again.");
  }

  const parsed = generatedPageSchema.safeParse(response.parsed_output);
  if (!parsed.success) {
    throw new AppError(502, "Generation produced an invalid page. Try again.");
  }

  const content = buildCraftContent(parsed.data);

  const template = await TemplateModel.create({
    userId: user._id,
    name: parsed.data.templateName,
    content: JSON.stringify(content),
  });

  return NextResponse.json({ template }, { status: 201 });
});

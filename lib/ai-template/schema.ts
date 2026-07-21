import { z } from "zod";

export const themeSchema = z.enum([
  "light",
  "brand",
  "dark",
  "warm",
  "cool",
  "bold",
  "pastel",
  "mono",
]);
export type Theme = z.infer<typeof themeSchema>;

export const heroSectionSchema = z.object({
  type: z.literal("hero"),
  eyebrow: z.string(), // "" means no eyebrow kicker
  headline: z.string(),
  body: z.string(),
  buttonLabel: z.string(), // "" means no button
  withImage: z.boolean(),
  theme: themeSchema,
});

export const featureGridSectionSchema = z.object({
  type: z.literal("feature_grid"),
  headline: z.string(), // "" means no headline above the grid
  imageCount: z.union([z.literal(3), z.literal(4), z.literal(5)]),
  theme: themeSchema,
});

export const featureCardsSectionSchema = z.object({
  type: z.literal("feature_cards"),
  eyebrow: z.string(), // "" means no eyebrow kicker
  headline: z.string(), // "" means no headline above the cards
  cards: z
    .array(
      z.object({
        title: z.string(),
        body: z.string(),
      })
    )
    .min(2)
    .max(4),
  theme: themeSchema,
});

export const contentSplitSectionSchema = z.object({
  type: z.literal("content_split"),
  eyebrow: z.string(), // "" means no eyebrow kicker
  headline: z.string(),
  body: z.string(),
  theme: themeSchema,
});

export const ctaBannerSectionSchema = z.object({
  type: z.literal("cta_banner"),
  eyebrow: z.string(), // "" means no eyebrow kicker
  headline: z.string(),
  body: z.string(),
  buttonLabel: z.string(),
  theme: themeSchema,
});

export const sectionSchema = z.discriminatedUnion("type", [
  heroSectionSchema,
  featureGridSectionSchema,
  featureCardsSectionSchema,
  contentSplitSectionSchema,
  ctaBannerSectionSchema,
]);
export type Section = z.infer<typeof sectionSchema>;

export const generatedPageSchema = z.object({
  templateName: z.string().min(1),
  sections: z.array(sectionSchema).min(2).max(6),
});
export type GeneratedPage = z.infer<typeof generatedPageSchema>;

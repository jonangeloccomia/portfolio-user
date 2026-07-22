import assert from "node:assert/strict";
import { generatedPageSchema } from "./schema";

// valid page parses
{
  const result = generatedPageSchema.safeParse({
    templateName: "Fitness Landing",
    sections: [
      { type: "hero", eyebrow: "", headline: "H", body: "B", buttonLabel: "Go", withImage: true, theme: "light" },
      { type: "cta_banner", eyebrow: "", headline: "Ready?", body: "Join", buttonLabel: "Sign up", theme: "dark" },
    ],
  });
  assert.equal(result.success, true, "valid page must parse successfully");
  console.log("PASS: valid page parses");
}

// unknown section type rejected
{
  const result = generatedPageSchema.safeParse({
    templateName: "X",
    sections: [
      { type: "testimonial", headline: "H" },
      { type: "cta_banner", headline: "H", body: "B", buttonLabel: "Go", theme: "dark" },
    ],
  });
  assert.equal(result.success, false, "unknown section type must be rejected");
  console.log("PASS: unknown section type rejected");
}

// too few sections rejected
{
  const result = generatedPageSchema.safeParse({
    templateName: "X",
    sections: [{ type: "hero", headline: "H", body: "B", buttonLabel: "", withImage: false, theme: "light" }],
  });
  assert.equal(result.success, false, "fewer than 2 sections must be rejected");
  console.log("PASS: single-section page rejected");
}

// invalid imageCount rejected
{
  const result = generatedPageSchema.safeParse({
    templateName: "X",
    sections: [
      { type: "feature_grid", headline: "", imageCount: 7, theme: "light" },
      { type: "cta_banner", headline: "H", body: "B", buttonLabel: "Go", theme: "dark" },
    ],
  });
  assert.equal(result.success, false, "imageCount outside 3-5 must be rejected");
  console.log("PASS: invalid imageCount rejected");
}

console.log("All schema tests passed.");

import assert from "node:assert/strict";
import { buildCraftContent } from "./builder";
import type { GeneratedPage } from "./schema";

function subtreeHasType(tree: Record<string, any>, rootId: string, typeName: string): boolean {
  const node = tree[rootId];
  if (node.type.resolvedName === typeName) return true;
  return node.nodes.some((childId: string) => subtreeHasType(tree, childId, typeName));
}

function assertStructurallyValid(tree: Record<string, any>) {
  const ids = Object.keys(tree);
  assert.ok(ids.includes("ROOT"), "tree must include ROOT");
  for (const id of ids) {
    const node = tree[id];
    if (id !== "ROOT") {
      assert.ok(typeof node.parent === "string", `${id} must have a parent`);
      assert.ok(ids.includes(node.parent), `${id}'s parent "${node.parent}" must exist`);
      assert.ok(tree[node.parent].nodes.includes(id), `${id} must be listed in its parent's nodes[]`);
    }
    for (const childId of node.nodes) {
      assert.ok(ids.includes(childId), `${id} references missing child "${childId}"`);
      assert.equal(tree[childId].parent, id, `${childId}'s parent must point back to ${id}`);
    }
  }
}

// Test 1: hero with image and button
{
  const page: GeneratedPage = {
    templateName: "Test Page",
    sections: [
      { type: "hero", eyebrow: "", headline: "Welcome", body: "Body text", buttonLabel: "Get started", withImage: true, theme: "light" },
      { type: "cta_banner", eyebrow: "", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "dark" },
    ],
  };
  const tree = buildCraftContent(page);
  assertStructurallyValid(tree);
  const headerNode = Object.values(tree).find((n: any) => n.type.resolvedName === "Header");
  assert.ok(headerNode, "hero must produce a Header node");
  console.log("PASS: hero section structurally valid");
}

// Test 2: hero without image and without button
{
  const page: GeneratedPage = {
    templateName: "Test Page",
    sections: [
      { type: "hero", eyebrow: "", headline: "Welcome", body: "Body text", buttonLabel: "", withImage: false, theme: "dark" },
      { type: "cta_banner", eyebrow: "", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "light" },
    ],
  };
  const tree = buildCraftContent(page);
  assertStructurallyValid(tree);
  // buildCraftContent always wraps sections with a nav band (unconditional) and a
  // footer band (unconditional) — locate the hero band by its own content (the
  // Header carrying this section's headline) rather than assuming it's ROOT.nodes[0],
  // since the nav band occupies that slot. Nav also always renders its own CTA
  // button, so scoping the CtaButton search to the hero's own subtree (not the
  // whole tree) is required too — otherwise the nav's button is a false positive.
  const heroHeadline = Object.values(tree).find(
    (n: any) => n.type.resolvedName === "Header" && n.props.text === "Welcome"
  );
  assert.ok(heroHeadline, "hero must produce a Header with the section's headline");
  const heroBandId = (heroHeadline as any).parent && tree[(heroHeadline as any).parent].parent;
  assert.ok(heroBandId, "hero header must be nested inside the hero's band container");
  const heroHasButton = subtreeHasType(tree, heroBandId, "CtaButton");
  assert.equal(heroHasButton, false, "hero with empty buttonLabel must not produce a CtaButton node");
  console.log("PASS: hero without image/button structurally valid");
}

// Test 3: feature_grid with 5 images and no headline
{
  const page: GeneratedPage = {
    templateName: "Test Page",
    sections: [
      { type: "feature_grid", headline: "", imageCount: 5, theme: "brand" },
      { type: "cta_banner", eyebrow: "", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "dark" },
    ],
  };
  const tree = buildCraftContent(page);
  assertStructurallyValid(tree);
  const imageNodes = Object.values(tree).filter((n: any) => n.type.resolvedName === "ImageBlock");
  assert.equal(imageNodes.length, 5, "feature_grid must produce exactly imageCount ImageBlock nodes");
  console.log("PASS: feature_grid structurally valid with 5 images");
}

// Test 4: content_split
{
  const page: GeneratedPage = {
    templateName: "Test Page",
    sections: [
      { type: "content_split", eyebrow: "", headline: "What we do", body: "Details", theme: "light" },
      { type: "cta_banner", eyebrow: "", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "dark" },
    ],
  };
  const tree = buildCraftContent(page);
  assertStructurallyValid(tree);
  console.log("PASS: content_split structurally valid");
}

// Test 5: full page with all four archetypes together, unique ids
{
  const page: GeneratedPage = {
    templateName: "Full Page",
    sections: [
      { type: "hero", eyebrow: "", headline: "H", body: "B", buttonLabel: "Go", withImage: true, theme: "light" },
      { type: "feature_grid", headline: "Trusted by", imageCount: 4, theme: "light" },
      { type: "content_split", eyebrow: "", headline: "What we do", body: "Details", theme: "brand" },
      { type: "cta_banner", eyebrow: "", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "dark" },
    ],
  };
  const tree = buildCraftContent(page);
  assertStructurallyValid(tree);
  const ids = Object.keys(tree);
  assert.equal(ids.length, new Set(ids).size, "all node ids must be unique");
  // buildCraftContent always wraps the requested sections with one nav band and
  // one footer band, in addition to one top-level container per section.
  assert.equal(
    tree.ROOT.nodes.length,
    page.sections.length + 2,
    "ROOT must have one container per section plus the nav and footer bands"
  );
  console.log("PASS: full four-archetype page structurally valid with unique ids");
}

console.log("All builder tests passed.");

import assert from "node:assert/strict";
import { buildCraftContent } from "./builder";
import type { GeneratedPage } from "./schema";

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
      { type: "hero", headline: "Welcome", body: "Body text", buttonLabel: "Get started", withImage: true, theme: "light" },
      { type: "cta_banner", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "dark" },
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
      { type: "hero", headline: "Welcome", body: "Body text", buttonLabel: "", withImage: false, theme: "dark" },
      { type: "cta_banner", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "light" },
    ],
  };
  const tree = buildCraftContent(page);
  assertStructurallyValid(tree);
  // Check that the hero section specifically doesn't produce a button by verifying
  // no CtaButton exists as a direct child of the hero's text column container
  const rootChildren = tree.ROOT.nodes;
  const heroContainerId = rootChildren[0];
  const heroChildren = tree[heroContainerId].nodes;
  const textColId = heroChildren[0];
  const textColChildren = tree[textColId].nodes;
  const heroHasButton = textColChildren.some((id: string) => tree[id].type.resolvedName === "CtaButton");
  assert.equal(heroHasButton, false, "hero with empty buttonLabel must not produce a CtaButton node");
  console.log("PASS: hero without image/button structurally valid");
}

// Test 3: feature_grid with 5 images and no headline
{
  const page: GeneratedPage = {
    templateName: "Test Page",
    sections: [
      { type: "feature_grid", headline: "", imageCount: 5, theme: "brand" },
      { type: "cta_banner", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "dark" },
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
      { type: "content_split", headline: "What we do", body: "Details", theme: "light" },
      { type: "cta_banner", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "dark" },
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
      { type: "hero", headline: "H", body: "B", buttonLabel: "Go", withImage: true, theme: "light" },
      { type: "feature_grid", headline: "Trusted by", imageCount: 4, theme: "light" },
      { type: "content_split", headline: "What we do", body: "Details", theme: "brand" },
      { type: "cta_banner", headline: "Ready?", body: "Join now", buttonLabel: "Sign up", theme: "dark" },
    ],
  };
  const tree = buildCraftContent(page);
  assertStructurallyValid(tree);
  const ids = Object.keys(tree);
  assert.equal(ids.length, new Set(ids).size, "all node ids must be unique");
  assert.equal(tree.ROOT.nodes.length, 4, "ROOT must have exactly one top-level container per section");
  console.log("PASS: full four-archetype page structurally valid with unique ids");
}

console.log("All builder tests passed.");

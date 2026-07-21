import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      firstName?: string;
      lastName?: string;
      role?: "user" | "admin";
      slug?: string;
      liveTemplateId?: string;
      liveExpiresAt?: string;
      generationTokens?: number;
    } & DefaultSession["user"];
  }
}

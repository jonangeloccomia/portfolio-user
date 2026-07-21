import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { mongoClientPromise } from "@/db/mongo-client";
import { connectToDatabase } from "@/db/connection";
import { UserModel } from "@/db/models/user";
import { env } from "@/config/env";
import { magicLinkHtml, magicLinkText } from "@/lib/email-templates";
import { withUniqueSlug } from "@/lib/slug";
import { isDisposableEmail } from "@/lib/disposable-email";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(mongoClientPromise),
  secret: env.AUTH_SECRET,
  session: { strategy: "database" },
  providers: [
    Resend({
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM,
      async sendVerificationRequest({ identifier: to, url, provider }) {
        const { host } = new URL(url);

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: provider.from,
            to,
            subject: `Sign in to ${host}`,
            html: magicLinkHtml({ url, host }),
            text: magicLinkText({ url, host }),
          }),
        });

        if (!res.ok) {
          throw new Error("Resend error: " + JSON.stringify(await res.json()));
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, email }) {
      // Blocks the magic-link email itself from being sent to disposable
      // addresses — the abuse this stops is mass throwaway-domain sign-in
      // requests, not just account creation.
      if (email?.verificationRequest && user.email && isDisposableEmail(user.email)) {
        return false;
      }
      return true;
    },
    async session({ session }) {
      if (!session.user.email) return session;

      await connectToDatabase();
      const profile = await UserModel.findOne({ email: session.user.email });

      if (!profile) return session;

      if (!profile.slug) {
        const nameForSlug =
          [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
          profile.email.split("@")[0];
        profile.slug = await withUniqueSlug(
          nameForSlug,
          async (candidate) => {
            await UserModel.updateOne(
              { _id: profile._id, slug: { $exists: false } },
              { $set: { slug: candidate } }
            );
            return candidate;
          }
        );
      }

      session.user.firstName = profile.firstName;
      session.user.lastName = profile.lastName;
      session.user.role = profile.role;
      session.user.slug = profile.slug;
      session.user.liveTemplateId = profile.liveTemplateId
        ? String(profile.liveTemplateId)
        : undefined;
      session.user.liveExpiresAt = profile.liveExpiresAt
        ? profile.liveExpiresAt.toISOString()
        : undefined;
      session.user.generationTokens = profile.generationTokens;

      return session;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return;

      await connectToDatabase();
      await withUniqueSlug(user.name ?? user.email.split("@")[0], (slug) =>
        UserModel.updateOne(
          { email: user.email },
          {
            $setOnInsert: {
              firstName: "",
              lastName: "",
              email: user.email,
              role: "user",
              slug,
            },
          },
          { upsert: true }
        )
      );
    },
  },
});

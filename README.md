# Campaignr

Campaignr is a landing page builder. Turn a prompt or a drag-and-drop canvas into a published landing page — no dev queue, no boilerplate.

**Live:** [campaignr.jonangelocomia.dev](https://campaignr.jonangelocomia.dev/)

## Features

- **AI-assisted generation** — describe a page and generate a starting layout, powered by the Anthropic SDK.
- **Drag-and-drop editor** — visual page builder built on [Craft.js](https://craft.js.org/), with a layers panel for structuring components.
- **Publishing** — publish pages to a shareable slug at `/landing/[slug]`.
- **Dashboard** — manage builder projects, published pages, and account profile.
- **Auth** — email/password auth via NextAuth, with a MongoDB adapter.
- **Billing** — Stripe-powered payments, invoicing, and address collection.
- **Email** — transactional email templates for account and billing flows.

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) + React 19
- [Craft.js](https://craft.js.org/) for the drag-and-drop editor
- MongoDB / Mongoose + NextAuth for data and auth
- Stripe for payments
- Tailwind CSS + Radix UI + shadcn for UI
- Zustand for client state, Zod for validation
- Vitest for tests

## Getting Started

Install dependencies, then run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

### Other scripts

```bash
npm run build     # production build
npm run start     # run production build
npm run lint      # lint
npm test          # run vitest
npm run db:seed   # seed the database (db/seed.ts)
```

## Project Structure

- `app/(auth)/` — login, register, and marketing landing page
- `app/dashboard/` — builder, published pages, profile
- `app/dashboard/builder/` — Craft.js editor (new page, edit by id)
- `app/landing/[slug]/` — public rendering of published pages
- `lib/starter-templates.ts` — starter templates for the builder
- `lib/email-templates.ts` — transactional email HTML

## Environment

Configure MongoDB, NextAuth, Stripe, and Anthropic API credentials via environment variables before running the app (see the respective SDK docs for required keys).

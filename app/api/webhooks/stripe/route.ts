import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { env } from "@/config/env";
import { connectToDatabase } from "@/db/connection";
import { recordPaymentAndExtend } from "@/lib/billing";
import { logger } from "@/middleware/logger";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    logger.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const templateId = session.metadata?.templateId;

    if (userId && templateId) {
      try {
        await connectToDatabase();
        const outcome = await recordPaymentAndExtend({
          stripeSessionId: session.id,
          userId,
          templateId,
          amountCents: session.amount_total ?? 300,
          currency: session.currency ?? "usd",
        });
        logger.info("Processed checkout.session.completed", { sessionId: session.id, outcome });
      } catch (error) {
        logger.error("Failed to process checkout.session.completed", { sessionId: session.id, error });
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
      }
    } else {
      logger.warn("checkout.session.completed missing metadata", { sessionId: session.id });
    }
  }

  return NextResponse.json({ received: true });
}

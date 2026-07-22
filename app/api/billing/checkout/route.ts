import { z } from "zod";
import { NextResponse } from "next/server";
import { withErrorHandling, AppError } from "@/middleware/error";
import { validate } from "@/middleware/validate";
import { requireUser } from "@/middleware/auth";
import { connectToDatabase } from "@/db/connection";
import { TemplateModel } from "@/db/models/template";
import { UserModel } from "@/db/models/user";
import { stripe } from "@/lib/stripe";

const checkoutSchema = z.object({ templateId: z.string().min(1) });

export const POST = withErrorHandling(async (request: Request) => {
  const user = await requireUser();
  const { templateId } = await validate(checkoutSchema, await request.json());

  await connectToDatabase();
  const template = await TemplateModel.findOne({
    _id: templateId,
    userId: user._id,
  }).lean();

  if (!template) {
    throw new AppError(404, "Template not found");
  }

  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({ email: user.email });
    stripeCustomerId = customer.id;
    await UserModel.updateOne({ _id: user._id }, { $set: { stripeCustomerId } });
  }

  const origin = new URL(request.url).origin;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    billing_address_collection: "auto",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: 300,
          product_data: { name: "Live page — 1 month" },
        },
      },
    ],
    metadata: {
      userId: String(user._id),
      templateId: String(template._id),
    },
    invoice_creation: {
      enabled: true,
      invoice_data: {
        description: `Live page — 1 month (${template.name})`,
        metadata: {
          userId: String(user._id),
          templateId: String(template._id),
        },
      },
    },
    success_url: `${origin}/dashboard/published?success=1`,
    cancel_url: `${origin}/dashboard/published?canceled=1`,
  });

  if (!checkoutSession.url) {
    throw new AppError(500, "Stripe did not return a checkout URL");
  }

  return NextResponse.json({ url: checkoutSession.url });
});

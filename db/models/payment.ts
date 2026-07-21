import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    amountCents: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { timestamps: true }
);

export type Payment = InferSchemaType<typeof paymentSchema>;

export const PaymentModel: Model<Payment> =
  (models.Payment as Model<Payment>) ?? model<Payment>("Payment", paymentSchema);

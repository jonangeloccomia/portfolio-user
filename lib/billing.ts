import mongoose from "mongoose";
import { PaymentModel } from "@/db/models/payment";
import { UserModel } from "@/db/models/user";

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

type DuplicateKeyError = Error & { code?: number; keyPattern?: Record<string, unknown> };

function isDuplicateSessionError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const mongoError = error as DuplicateKeyError;
  return mongoError.code === 11000 && !!mongoError.keyPattern?.stripeSessionId;
}

export async function recordPaymentAndExtend(params: {
  stripeSessionId: string;
  userId: string;
  templateId: string;
  amountCents: number;
  currency: string;
}): Promise<"processed" | "duplicate"> {
  const session = await mongoose.startSession();
  let result: "processed" | "duplicate" = "processed";

  try {
    await session.withTransaction(async () => {
      try {
        await PaymentModel.create(
          [
            {
              userId: params.userId,
              templateId: params.templateId,
              stripeSessionId: params.stripeSessionId,
              amountCents: params.amountCents,
              currency: params.currency,
            },
          ],
          { session }
        );
      } catch (error) {
        if (isDuplicateSessionError(error)) {
          result = "duplicate";
          return;
        }
        throw error;
      }

      const user = await UserModel.findById(params.userId).session(session).lean();
      if (!user) {
        throw new Error(`User ${params.userId} not found while recording payment`);
      }

      const activeExpiry =
        user.liveExpiresAt && user.liveExpiresAt > new Date() ? user.liveExpiresAt : new Date();

      await UserModel.updateOne(
        { _id: params.userId },
        {
          $set: {
            liveExpiresAt: new Date(activeExpiry.getTime() + THIRTY_DAYS_MS),
            liveTemplateId: new mongoose.Types.ObjectId(params.templateId),
          },
        },
        { session }
      );
    });

    return result;
  } finally {
    await session.endSession();
  }
}

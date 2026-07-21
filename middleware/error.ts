import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { logger } from "@/middleware/logger";

export class AppError extends Error {
  statusCode: number;
  code?: string;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function withErrorHandling<Context = { params: Promise<Record<string, string>> }>(
  handler: (request: Request, context: Context) => Promise<Response>
) {
  return async (request: Request, context: Context): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      if (error instanceof AppError) {
        return NextResponse.json(
          { error: error.message, code: error.code },
          { status: error.statusCode }
        );
      }

      if (error instanceof ZodError) {
        return NextResponse.json(
          { error: "Invalid request" },
          { status: 400 }
        );
      }

      logger.error("Unhandled error in route handler", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}

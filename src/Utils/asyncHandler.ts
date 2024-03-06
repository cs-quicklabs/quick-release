import { ApiError } from "./ApiError";
import { NextResponse } from "next/server";

const asyncHandler = async (requestHandler: () => Promise<any>) => {
  try {
    return await requestHandler();
  } catch (error) {
    if (error instanceof ApiError) {
      const response = {
        ...error,
        message: error.message,
        ...(process.env.NODE_ENV !== "production"
          ? { stack: error.stack }
          : {}), // Error stack traces should be visible in development for debugging
      };

      return NextResponse.json(response, { status: error.statusCode });
    }

    return NextResponse.json(error, { status: 500 });
  }
};

export { asyncHandler };

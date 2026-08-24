import { apiProxy } from "@/src/lib/serverHelper";
import { NextRequest, NextResponse } from "next/server";
const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function PUT(_request: NextRequest) {
  try {
    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/notifications/mark-all-read`,
      {
        method: "PUT",
      },
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/src/lib/serverHelper";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/vendors?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching vendors proxy:", error);
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

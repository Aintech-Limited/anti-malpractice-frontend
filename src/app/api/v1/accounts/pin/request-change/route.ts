import { apiProxy } from "@/src/lib/serverHelper";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = await apiProxy(
      `${process.env.BACKEND_API_URL}/v1/accounts/pin/request-change`,
      {
        method: "POST",
      },
    );

    const data = await response.json();
    console.log(data);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

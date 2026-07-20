import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/src/lib/serverHelper";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();

    const response = await apiProxy(
      `${process.env.BACKEND_API_URL}/v1/accounts/${(await params).id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin: body.pin }),
      },
    );

    if (!response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json({}, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}

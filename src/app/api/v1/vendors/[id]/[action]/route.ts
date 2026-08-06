import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/src/lib/serverHelper";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; action: string }> },
) {
  try {
    const { id, action } = await params;

    if (action !== "approve" && action !== "revoke") {
      return NextResponse.json(
        { success: false, message: "Invalid action route" },
        { status: 400 },
      );
    }

    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/vendors/${id}/${action}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(
      `Error in vendor action proxy (${(await params).action}):`,
      error,
    );
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; action: string } },
) {
  try {
    const { id, action } = params;

    if (action !== "remove") {
      return NextResponse.json(
        { success: false, message: "Invalid action route" },
        { status: 400 },
      );
    }

    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/vendors/${id}/revoke`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error in vendor remove proxy:", error);
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

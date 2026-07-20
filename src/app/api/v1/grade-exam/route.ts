import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/src/lib/serverHelper";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { examId, questionId, grades } = body;

    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/question-answers/bulk-grade`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ examId, questionId, grades }),
      },
    );

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
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

import { apiProxy } from "@/src/lib/serverHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchedParams = request.nextUrl.searchParams;
    if (!searchedParams.has("examId") || !searchedParams.has("examAttemptId")) {
      return NextResponse.json(
        {
          message: "could not fetch exam. Missing path params",
          success: false,
        },
        { status: 400 },
      );
    }
    const examId = searchedParams.get("examId");
    const examAttemptId = searchedParams.get("examAttemptId");
    const response = await apiProxy(
      `${process.env.BACKEND_API_URL}/v1/exams/questions/${examId}/live/${examAttemptId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-cache",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }
    console.log(data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching student live exam questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

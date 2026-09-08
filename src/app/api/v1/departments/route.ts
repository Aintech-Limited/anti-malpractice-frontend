import { NextRequest, NextResponse } from "next/server";
import { apiProxy } from "@/src/lib/serverHelper";

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams;
    const institutionId = params.get("institutionId");
    if (!institutionId) {
      return NextResponse.json(
        { message: "Institution is requiredto fetch Departments" },
        { status: 400 },
      );
    }
    const response = await apiProxy(
      `${process.env.BACKEND_API_URL}/v1/departments?${params.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "GET",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

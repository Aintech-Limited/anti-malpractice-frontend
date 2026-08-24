import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> },
) {
  try {
    const { departmentId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const sortBy = searchParams.get("sortBy");
    const sortOrder = searchParams.get("sortOrder");
    const creditHours = searchParams.get("creditHours");
    const semester = searchParams.get("semester");
    const level = searchParams.get("level");
    const status = searchParams.get("status");

    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit);
    queryParams.append("page", page);
    if (sortBy) queryParams.append("sortBy", sortBy);
    if (sortOrder) queryParams.append("sortOrder", sortOrder);
    if (creditHours) queryParams.append("creditHours", creditHours);
    if (semester) queryParams.append("semester", semester);
    if (level) queryParams.append("level", level);
    if (status) queryParams.append("status", status);

    const response = await fetch(
      `${BACKEND_API_URL}/v1/admins/departments/${departmentId}/courses${queryParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
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

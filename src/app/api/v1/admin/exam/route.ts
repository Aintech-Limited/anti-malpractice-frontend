import { apiProxy } from "@/src/lib/serverHelper";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";
    const adminStatus = searchParams.get("adminStatus") || "";
    const type_ = searchParams.get("type_") || "";
    const departmentId = searchParams.get("departmentId") || "";
    const courseId = searchParams.get("courseId") || "";
    const published = searchParams.get("published");
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);
    if (adminStatus) queryParams.append("adminStatus", adminStatus);
    if (type_) queryParams.append("type_", type_);
    if (departmentId) queryParams.append("departmentId", departmentId);
    if (courseId) queryParams.append("courseId", courseId);
    if (published) queryParams.append("published", published);
    if (startDate) queryParams.append("startDate", startDate);
    if (endDate) queryParams.append("endDate", endDate);

    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/admins/exams?${queryParams.toString()}`,
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

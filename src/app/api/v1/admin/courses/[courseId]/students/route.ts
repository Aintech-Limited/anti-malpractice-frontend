import { apiProxy } from "@/src/lib/serverHelper";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> },
) {
  try {
    const { courseId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const search = searchParams.get("search") || "";
    const faceAuthEnabled = searchParams.get("faceAuthEnabled");
    const isBlocked = searchParams.get("isBlocked");
    const emailVerified = searchParams.get("emailVerified");
    const level = searchParams.get("level");

    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    if (search) queryParams.append("search", search);
    if (faceAuthEnabled) queryParams.append("faceAuthEnabled", faceAuthEnabled);
    if (isBlocked) queryParams.append("isBlocked", isBlocked);
    if (emailVerified) queryParams.append("emailVerified", emailVerified);
    if (level) queryParams.append("level", level);

    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/admins/courses/${courseId}/students?${queryParams.toString()}`,
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

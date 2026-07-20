import { apiProxy } from "@/src/lib/serverHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await apiProxy(
      `${process.env.BACKEND_API_URL}/v1/users/admins`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { ...(await response.json()) },
        { status: response.status },
      );
    }
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("error getting admin users: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false, data: [] },
      { status: 500 },
    );
  }
}

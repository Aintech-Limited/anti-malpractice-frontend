import { apiProxy } from "@/src/lib/serverHelper";
import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const departmentId = searchParams.get("departmentId");
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "10";
    const studentStatus = searchParams.get("studentStatus");

    if (!departmentId) {
      return NextResponse.json(
        { success: false, message: "Department ID is required" },
        { status: 400 },
      );
    }

    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/admins/departments/${departmentId}/students?page=${page}&limit=${limit}&studentStatus=${studentStatus}`,
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      studentId,
      blockType,
      studentEmail,
      emailTemplateType,
      customMessage,
      sendEmail,
    } = body;

    const payload = {
      studentId,
      ...(blockType && {
        block:
          blockType && blockType === "block"
            ? true
            : blockType && blockType === "unblock"
              ? false
              : undefined,
      }),

      ...(sendEmail && { email: studentEmail }),
      ...(sendEmail && { emailTemplateType }),
      ...(sendEmail && { customMessage }),
    };
    const response = await apiProxy(
      `${BACKEND_API_URL}/v1/admins/students/${sendEmail ? "send-email" : "block"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
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

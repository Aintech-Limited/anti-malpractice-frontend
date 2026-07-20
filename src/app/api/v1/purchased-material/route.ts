import { apiProxy } from "@/src/lib/serverHelper";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const materialId = searchParams.get("materialId");
  if (!materialId) {
    return NextResponse.json(
      { message: "Missing materialId", success: false },
      { status: 400 },
    );
  }
  try {
    const response = await apiProxy(
      `${process.env.BACKEND_API_URL}/v1/purchased-materials/${materialId}/download`,
      {
        method: "GET",
      },
      false,
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("error: ", JSON.stringify(error));
      return NextResponse.json(error, { status: response.status });
    }

    const contentType =
      response.headers.get("content-type") || "application/pdf";
    const contentDisposition =
      response.headers.get("content-disposition") ||
      'attachment; filename="download.pdf"';

    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": contentDisposition,
      },
    });
  } catch (error) {
    console.error("Error fetching donwloadable material:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

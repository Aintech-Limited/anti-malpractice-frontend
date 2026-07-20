import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const formData = await request.formData();
    console.log([...formData.keys()]);

    if (!formData.has("front") || !formData.has("back")) {
      return NextResponse.json(
        { message: "Missing ID images" },
        { status: 400 },
      );
    }

    const response = await fetch(`${process.env.BACKEND_API_URL}/v1/kyc/id`, {
      method: "POST",
      credentials: "include",
      headers: {
        ...(cookieHeader && { cookie: cookieHeader }),
      },
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { ...(await response.json()) },
        { status: response.status },
      );
    }
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("error upload kyc ID: ", error);
    return NextResponse.json({ message: "Upload failed" }, { status: 500 });
  }
}

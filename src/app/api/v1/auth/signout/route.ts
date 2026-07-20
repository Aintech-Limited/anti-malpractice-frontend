import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/v1/auth/signout`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(cookieHeader && { cookie: cookieHeader }),
        },
      },
    );

    if (!response.ok) {
      if (response.status === 401) {
        const nextResponse = NextResponse.json(
          { success: true },
          { status: 200 },
        );

        nextResponse.cookies.set(process.env.AUTH_TOKEN_NAME!, "", {
          path: "/",
          expires: new Date(0),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });

        nextResponse.cookies.set(process.env.AUTH_REFRESH_TOKEN_NAME!, "", {
          path: "/",
          expires: new Date(0),
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return nextResponse;
      }
      return NextResponse.json(
        { ...(await response.json()) },
        { status: response.status },
      );
    }

    const nextResponse = NextResponse.json({ success: true }, { status: 200 });

    nextResponse.cookies.set(process.env.AUTH_TOKEN_NAME!, "", {
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    nextResponse.cookies.set(process.env.AUTH_REFRESH_TOKEN_NAME!, "", {
      path: "/",
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return nextResponse;
  } catch (error) {
    console.error("error signout: ", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 },
    );
  }
}

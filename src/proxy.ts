import { NextRequest, NextResponse } from "next/server";
import { decodeMyJwt } from "./lib/serverHelper";
import {
  ProtectedRouteEnum,
  UnProtectedRouteEnum,
  UserRoleTypeEnum,
} from "./lib/enums";
import { cookies } from "next/headers";

export async function proxy(request: NextRequest) {
  let visitcount = 1;
  const visitcookie = request.cookies.get("visit_count")?.value || "0";
  visitcount = parseInt(visitcookie) + 1;

  const pathname = request.nextUrl.pathname;

  const token = request.cookies.get(process.env.AUTH_TOKEN_NAME!)?.value;
  const refreshToken = request.cookies.get(
    process.env.AUTH_REFRESH_TOKEN_NAME!,
  )?.value;

  // Public
  if (
    [
      UnProtectedRouteEnum.SIGNIN,
      UnProtectedRouteEnum.SIGNUP,
      UnProtectedRouteEnum.VERIFY,
      UnProtectedRouteEnum.FORGOT_PASSWORD,
      UnProtectedRouteEnum.HOME,
    ].includes(pathname as any)
  ) {
    if (token) {
      const redirectResponse = NextResponse.redirect(
        new URL(ProtectedRouteEnum.DASHBOARD, request.url),
      );
      redirectResponse.cookies.set("visit_count", visitcount.toString(), {
        maxAge: 60 * 60 * 24 * 3650, // 10 year
        path: "/",
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return redirectResponse;
    }
    const nextResponse = NextResponse.next();
    nextResponse.cookies.delete("ProfileType");

    nextResponse.cookies.set("visit_count", visitcount.toString(), {
      maxAge: 60 * 60 * 24 * 3650, // 10 year
      path: "/",
      httpOnly: process.env.NODE_ENV === "production",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return nextResponse;
  }

  // REFRESH TOKENs

  if (!token && refreshToken) {
    console.log("refreshing token... ");
    const response = await fetch(
      `${process.env.BACKEND_API_URL}/v1/auth/refresh`,
      {
        credentials: "include",
        method: "POST",
        headers: {
          Authorization: `Bearer ${refreshToken}`,
          cookie: (await cookies()).toString(), // Result: 'sessionId=abc123; userId=456'
        },
      },
    );
    const resCookie = response.headers.getSetCookie();
    // console.log('resCookie: ', resCookie);
    // Result: [
    //   'sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Lax',
    // ]
    if (response.ok) {
      const nextResponse = NextResponse.next();
      resCookie.forEach((c) => {
        nextResponse.headers.append("Set-Cookie", c);
      });
      return nextResponse;
    } else {
      const redirectResponse = NextResponse.redirect(
        new URL(UnProtectedRouteEnum.SIGNIN, request.url),
      );
      if (response.status === 401) {
        redirectResponse.cookies.delete(process.env.AUTH_REFRESH_TOKEN_NAME);
        redirectResponse.cookies.delete(process.env.AUTH_TOKEN_NAME);
        redirectResponse.cookies.delete("ProfileType");
      }
      redirectResponse.cookies.set("visit_count", visitcount.toString(), {
        maxAge: 60 * 60 * 24 * 3650, // 10 year
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return redirectResponse;
    }
  }

  if (!token && !refreshToken) {
    return NextResponse.next();
  }

  const decodedToken = await decodeMyJwt(token!);

  const currentTime = Math.floor(Date.now() / 1000);
  const isExpired = decodedToken.exp ? decodedToken.exp < currentTime : false;

  if (isExpired) {
    console.log("Token expired");
    return NextResponse.redirect(
      new URL(UnProtectedRouteEnum.SIGNIN, request.url),
    );
  }

  // // Protected
  if (Object.values(ProtectedRouteEnum).includes(pathname as any)) {
    if (!token) {
      if (refreshToken) {
        return NextResponse.next();
      }
      const redirectResponse = NextResponse.redirect(
        new URL(UnProtectedRouteEnum.SIGNIN, request.url),
      );
      redirectResponse.cookies.set("visit_count", visitcount.toString(), {
        maxAge: 60 * 60 * 24 * 3650, // 10 year
        path: "/",
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return redirectResponse;
    }

    try {
      const nextResponse = NextResponse.next();
      nextResponse.cookies.set("visit_count", visitcount.toString(), {
        maxAge: 60 * 60 * 24 * 3650, // 10 year
        path: "/",
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      // admins
      if (
        (pathname === ProtectedRouteEnum.DASHBOARD &&
          decodedToken.role === UserRoleTypeEnum.ADMIN) ||
        (pathname.startsWith(ProtectedRouteEnum.STUDENTS) &&
          decodedToken.role === UserRoleTypeEnum.ADMIN) ||
        pathname === ProtectedRouteEnum.FACE_CAPTURE ||
        pathname === ProtectedRouteEnum.DASHBOARD_VERIFY ||
        (pathname.startsWith(ProtectedRouteEnum.VENDORS) &&
          decodedToken.role === UserRoleTypeEnum.ADMIN) ||
        (pathname.startsWith(ProtectedRouteEnum.LECTURERS) &&
          decodedToken.role === UserRoleTypeEnum.ADMIN)
      ) {
        const redirectResponse = NextResponse.redirect(
          new URL(ProtectedRouteEnum.ADMINS, request.url),
        );
        redirectResponse.cookies.set("visit_count", visitcount.toString(), {
          maxAge: 60 * 60 * 24 * 3650, // 10 year
          path: "/",
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return redirectResponse;
      }
      // lecturers
      if (
        (pathname === ProtectedRouteEnum.DASHBOARD &&
          decodedToken.role === UserRoleTypeEnum.LECTURER) ||
        (pathname.startsWith(ProtectedRouteEnum.STUDENTS) &&
          decodedToken.role === UserRoleTypeEnum.LECTURER) ||
        pathname === ProtectedRouteEnum.FACE_CAPTURE ||
        (pathname.startsWith(ProtectedRouteEnum.ADMINS) &&
          decodedToken.role === UserRoleTypeEnum.LECTURER) ||
        (pathname.startsWith(ProtectedRouteEnum.VENDORS) &&
          decodedToken.role === UserRoleTypeEnum.LECTURER)
      ) {
        const redirectResponse = NextResponse.redirect(
          new URL(ProtectedRouteEnum.LECTURERS, request.url),
        );
        redirectResponse.cookies.set("visit_count", visitcount.toString(), {
          maxAge: 60 * 60 * 24 * 3650, // 10 year
          path: "/",
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return redirectResponse;
      }
      // vendors
      if (
        (pathname === ProtectedRouteEnum.DASHBOARD &&
          decodedToken.role === UserRoleTypeEnum.VENDOR) ||
        (pathname.startsWith(ProtectedRouteEnum.STUDENTS) &&
          decodedToken.role === UserRoleTypeEnum.VENDOR) ||
        pathname === ProtectedRouteEnum.FACE_CAPTURE ||
        (pathname.startsWith(ProtectedRouteEnum.ADMINS) &&
          decodedToken.role === UserRoleTypeEnum.VENDOR) ||
        (pathname.startsWith(ProtectedRouteEnum.LECTURERS) &&
          decodedToken.role === UserRoleTypeEnum.VENDOR)
      ) {
        const redirectResponse = NextResponse.redirect(
          new URL(ProtectedRouteEnum.VENDORS, request.url),
        );
        redirectResponse.cookies.set("visit_count", visitcount.toString(), {
          maxAge: 60 * 60 * 24 * 3650, // 10 year
          path: "/",
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return redirectResponse;
      }

      // students
      if (
        (pathname === ProtectedRouteEnum.DASHBOARD &&
          decodedToken.role === UserRoleTypeEnum.STUDENT) ||
        (pathname.startsWith(ProtectedRouteEnum.LECTURERS) &&
          decodedToken.role === UserRoleTypeEnum.STUDENT) ||
        (pathname.startsWith(ProtectedRouteEnum.ADMINS) &&
          decodedToken.role === UserRoleTypeEnum.STUDENT) ||
        (pathname.startsWith(ProtectedRouteEnum.LECTURERS) &&
          decodedToken.role === UserRoleTypeEnum.STUDENT) ||
        pathname === ProtectedRouteEnum.DASHBOARD_VERIFY
      ) {
        const redirectResponse = NextResponse.redirect(
          new URL(ProtectedRouteEnum.STUDENTS, request.url),
        );
        redirectResponse.cookies.set("visit_count", visitcount.toString(), {
          maxAge: 60 * 60 * 24 * 3650, // 10 year
          path: "/",
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return redirectResponse;
      }
      if (
        pathname === ProtectedRouteEnum.DASHBOARD_VERIFY &&
        decodedToken.profileType !== UserRoleTypeEnum.LECTURER
      ) {
        const redirectResponse = NextResponse.redirect(
          new URL(ProtectedRouteEnum.DASHBOARD, request.url),
        );
        redirectResponse.cookies.set("visit_count", visitcount.toString(), {
          maxAge: 60 * 60 * 24 * 3650, // 10 year
          path: "/",
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return redirectResponse;
      }
      if (
        pathname === ProtectedRouteEnum.FACE_CAPTURE &&
        decodedToken.profileType !== UserRoleTypeEnum.STUDENT
      ) {
        const redirectResponse = NextResponse.redirect(
          new URL(ProtectedRouteEnum.DASHBOARD, request.url),
        );
        redirectResponse.cookies.set("visit_count", visitcount.toString(), {
          maxAge: 60 * 60 * 24 * 3650, // 10 year
          path: "/",
          httpOnly: process.env.NODE_ENV === "production",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
        return redirectResponse;
      }

      return nextResponse;
    } catch {
      const redirectResponse = NextResponse.redirect(
        new URL(UnProtectedRouteEnum.SIGNIN, request.url),
      );
      redirectResponse.cookies.set("visit_count", visitcount.toString(), {
        maxAge: 60 * 60 * 24 * 3650, // 10 year
        path: "/",
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return redirectResponse;
    }
  }

  const nextResponse = NextResponse.next();
  nextResponse.cookies.set("visit_count", visitcount.toString(), {
    maxAge: 60 * 60 * 24 * 3650, // 10 year
    path: "/",
    httpOnly: process.env.NODE_ENV === "production",
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return nextResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};

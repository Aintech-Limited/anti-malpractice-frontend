import { NextRequest, NextResponse } from 'next/server';
import { decodeMyJwt } from './lib/serverHelper';
import { ProtectedRouteEnum } from './lib/enums';
import { cookies } from 'next/headers';

export async function proxy(request: NextRequest) {
	let visitcount = 1;
	const visitcookie = request.cookies.get('visit_count')?.value || '0';
	visitcount = parseInt(visitcookie) + 1;

	const pathname = request.nextUrl.pathname;

	const token = request.cookies.get(process.env.AUTH_TOKEN_NAME!)?.value;
	const refreshToken = request.cookies.get(
		process.env.AUTH_REFRESH_TOKEN_NAME!,
	)?.value;

	// Public
	if (['/signin', '/signup'].includes(pathname)) {
		if (token) {
			const redirectResponse = NextResponse.redirect(
				new URL('/dashboard', request.url),
			);
			redirectResponse.cookies.set('visit_count', visitcount.toString(), {
				maxAge: 60 * 60 * 24 * 3650, // 10 year
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
			});
			return redirectResponse;
		}
		const nextResponse = NextResponse.next();
		nextResponse.cookies.delete('ProfileType');

		nextResponse.cookies.set('visit_count', visitcount.toString(), {
			maxAge: 60 * 60 * 24 * 3650, // 10 year
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});

		return nextResponse;
	}

	// REFRESH TOKENs

	if (!token && refreshToken) {
		console.log('refreshing token... ');
		const response = await fetch(
			`${process.env.BACKEND_API_URL}/v1/auth/refresh`,
			{
				credentials: 'include',
				method: 'POST',
				headers: {
					Authorization: `Bearer ${refreshToken}`,
					cookie: (await cookies()).toString(), // Result: 'sessionId=abc123; userId=456'
				},
			},
		);
		const resCookie = response.headers.getSetCookie();
		console.log('resCookie: ', resCookie);
		// Result: [
		//   'sessionId=abc123; Path=/; HttpOnly; Secure; SameSite=Lax',
		// ]
		if (response.ok) {
			const nextResponse = NextResponse.next();
			resCookie.forEach((c) => {
				nextResponse.headers.append('Set-Cookie', c);
			});
			return nextResponse;
		} else {
			const redirectResponse = NextResponse.redirect(
				new URL('/signin', request.url),
			);
			if (response.status === 401) {
				redirectResponse.cookies.delete(process.env.AUTH_REFRESH_TOKEN_NAME);
				redirectResponse.cookies.delete(process.env.AUTH_TOKEN_NAME);
				redirectResponse.cookies.delete('ProfileType');
			}
			redirectResponse.cookies.set('visit_count', visitcount.toString(), {
				maxAge: 60 * 60 * 24 * 3650, // 10 year
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
			});
			return redirectResponse;
		}
	}

	// // Protected
	if (Object.values(ProtectedRouteEnum).includes(pathname as any)) {
		if (!token) {
			if (refreshToken) {
				return NextResponse.next();
			}
			const redirectResponse = NextResponse.redirect(
				new URL('/signin', request.url),
			);
			redirectResponse.cookies.set('visit_count', visitcount.toString(), {
				maxAge: 60 * 60 * 24 * 3650, // 10 year
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
			});
			return redirectResponse;
		}

		try {
			const decodedToken = await decodeMyJwt(token);
			const nextResponse = NextResponse.next();
			nextResponse.cookies.set('visit_count', visitcount.toString(), {
				maxAge: 60 * 60 * 24 * 3650, // 10 year
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
			});

			if (
				(pathname === '/dashboard' &&
					decodedToken.profileType === 'LECTURER') ||
				(pathname.startsWith('/dashboard/students') &&
					decodedToken.profileType === 'LECTURER')
			) {
				const redirectResponse = NextResponse.redirect(
					new URL('/dashboard/lecturers', request.url),
				);
				redirectResponse.cookies.set('visit_count', visitcount.toString(), {
					maxAge: 60 * 60 * 24 * 3650, // 10 year
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
				});
				return redirectResponse;
			}
			if (
				(pathname === '/dashboard' && decodedToken.profileType === 'STUDENT') ||
				(pathname.startsWith('/dashboard/lecturers') &&
					decodedToken.profileType === 'STUDENT')
			) {
				const redirectResponse = NextResponse.redirect(
					new URL('/dashboard/students', request.url),
				);
				redirectResponse.cookies.set('visit_count', visitcount.toString(), {
					maxAge: 60 * 60 * 24 * 3650, // 10 year
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
				});
				return redirectResponse;
			}
			if (
				pathname === '/dashboard/verify' &&
				decodedToken.profileType === 'STUDENT'
			) {
				const redirectResponse = NextResponse.redirect(
					new URL('/dashboard/students', request.url),
				);
				redirectResponse.cookies.set('visit_count', visitcount.toString(), {
					maxAge: 60 * 60 * 24 * 3650, // 10 year
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
				});
				return redirectResponse;
			}
			if (
				pathname === '/dashboard/face-capture' &&
				decodedToken.profileType === 'LECTURER'
			) {
				const redirectResponse = NextResponse.redirect(
					new URL('/dashboard/lecturers', request.url),
				);
				redirectResponse.cookies.set('visit_count', visitcount.toString(), {
					maxAge: 60 * 60 * 24 * 3650, // 10 year
					path: '/',
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					sameSite: 'lax',
				});
				return redirectResponse;
			}

			return nextResponse;
		} catch {
			const redirectResponse = NextResponse.redirect(
				new URL('/signin', request.url),
			);
			redirectResponse.cookies.set('visit_count', visitcount.toString(), {
				maxAge: 60 * 60 * 24 * 3650, // 10 year
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
			});
			return redirectResponse;
		}
	}

	const nextResponse = NextResponse.next();
	nextResponse.cookies.set('visit_count', visitcount.toString(), {
		maxAge: 60 * 60 * 24 * 3650, // 10 year
		path: '/',
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
	});

	return nextResponse;
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};

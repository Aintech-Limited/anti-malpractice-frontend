import { NextRequest, NextResponse } from 'next/server';
import { decodeMyJwt } from './lib/serverHelper';
import { ProtectedRouteEnum } from './lib/enums';

export async function proxy(request: NextRequest) {
	let visitcount = 1;
	const visitcookie = request.cookies.get('visit_count')?.value || '0';
	visitcount = parseInt(visitcookie) + 1;

	const pathname = request.nextUrl.pathname;

	const token = request.cookies.get(process.env.AUTH_TOKEN_NAME!)?.value;

	// Public
	if (pathname === '/signin' || pathname === '/signup') {
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

		nextResponse.cookies.set('visit_count', visitcount.toString(), {
			maxAge: 60 * 60 * 24 * 3650, // 10 year
			path: '/',
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		});

		return nextResponse;
	}

	// Protected
	if (Object.values(ProtectedRouteEnum).includes(pathname as any)) {
		if (!token) {
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
			await decodeMyJwt(token);
			const nextResponse = NextResponse.next();
			nextResponse.cookies.set('visit_count', visitcount.toString(), {
				maxAge: 60 * 60 * 24 * 3650, // 10 year
				path: '/',
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'lax',
			});

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

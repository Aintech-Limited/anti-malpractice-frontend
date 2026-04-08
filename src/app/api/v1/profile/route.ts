import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
	try {
		const cookieHeader = request.headers.get('cookie');
		const body = await request.json();

		const response = await apiProxy(`${process.env.BACKEND_API_URL}/v1/users`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
				...(cookieHeader && { cookie: cookieHeader }),
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		);
	}
}

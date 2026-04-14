import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { apiProxy } from '@/src/lib/serverHelper';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const cookieStore = await cookies();

		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/payments/initiate/course-materials`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Cookie: cookieStore.toString(),
				},
				body: JSON.stringify(body),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error purchasing course material:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

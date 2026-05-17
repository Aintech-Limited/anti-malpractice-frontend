import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const limit = searchParams.get('limit') || '50';
		const departmentId = searchParams.get('departmentId') || '';

		const queryParams = new URLSearchParams();
		queryParams.append('limit', limit);
		if (departmentId) queryParams.append('departmentId', departmentId);

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/courses/staff?${queryParams.toString()}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		const data = await response.json();
		// console.log(data);

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Proxy error:', error);
		return NextResponse.json(
			{
				success: false,
				message:
					error instanceof Error ? error.message : 'Internal server error',
			},
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await apiProxy(`${BACKEND_API_URL}/v1/admins/courses`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		);
	}
}

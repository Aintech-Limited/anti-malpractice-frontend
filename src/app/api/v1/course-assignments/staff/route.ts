import { NextRequest, NextResponse } from 'next/server';
import { apiProxy } from '@/src/lib/serverHelper';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const params = searchParams.toString() ?? 'status=ACTIVE&page=1&limit=100';
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course-assignments/staff?${params}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error fetching assigned courses:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

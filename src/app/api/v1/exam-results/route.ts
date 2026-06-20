import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const courseCode = searchParams.get('courseCode');
		const page = searchParams.get('page') || '1';
		const limit = searchParams.get('limit') || '20';

		if (!courseCode) {
			return NextResponse.json(
				{ success: false, message: 'Course code is required' },
				{ status: 400 },
			);
		}

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/exam-results?courseCode=${encodeURIComponent(courseCode)}&page=${page}&limit=${limit}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		const data = await response.json();
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

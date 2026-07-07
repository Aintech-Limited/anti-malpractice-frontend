import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/students-management/suspend`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
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

export async function GET(request: NextRequest) {
	try {
		const params = request.nextUrl.searchParams;
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/students-management?${params.toString()}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'GET',
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error fetching students for admins:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

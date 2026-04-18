import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const params = request.nextUrl.searchParams;
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/exam-registrations?${params.toString()}`,
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
		console.error('Error fetching exam registrations:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/exam-registrations`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
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
		console.error('Error registering exam :', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

import { NextRequest, NextResponse } from 'next/server';
import { apiProxy } from '@/src/lib/serverHelper';

export async function GET(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course-materials?${searchParams.toString()}`,
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
		console.error('Error fetching available materials:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function POST(request: NextRequest) {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course-materials/vendors`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
				body: JSON.stringify(await request.json()),
			},
		);

		const data = await response.json();

		if (!response.ok) {
			console.error('error: ', JSON.stringify(data));
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error creating course materials:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ courseId: string }> },
) {
	try {
		const { courseId } = await params;

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/admins/courses/${courseId}`,
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

export async function PUT(
	request: NextRequest,
	{ params }: { params: Promise<{ courseId: string }> },
) {
	try {
		const { courseId } = await params;
		const body = await request.json();

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/admins/courses/${courseId}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			},
		);

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ courseId: string }> },
) {
	try {
		const { courseId } = await params;
		const body = await request.json();
		const queryParams = new URLSearchParams();
		const searchParams = request.nextUrl.searchParams;
		const archive = searchParams.get('archive');
		if (archive) queryParams.append('archive', archive);

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/admins/courses/${courseId}?${queryParams.toString()}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		);
	}
}

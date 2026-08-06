import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ courseId: string }> },
) {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course-materials/${(await params).courseId}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		const data = await response.json();

		if (!response.ok) {
			console.error('error: ', JSON.stringify(data));
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

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ courseId: string }> },
) {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course-materials/${(await params).courseId}/vendors`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'PATCH',
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
		console.error('Error modifying course materials:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ courseId: string }> },
) {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course-materials/${(await params).courseId}/vendors`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'DELETE',
			},
		);

		const data = await response.json();

		if (!response.ok) {
			console.error('error: ', JSON.stringify(data));
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error deleting course materials:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ notificationId: string }> },
) {
	try {
		const body = await request.json();
		const { notificationId } = await params;
		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/notifications/${notificationId}`,
			{
				method: 'PATCH',
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
			{
				success: false,
				message:
					error instanceof Error ? error.message : 'Internal server error',
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ notificationId: string }> },
) {
	const { notificationId } = await params;
	try {
		const response = await apiProxy(
			`${BACKEND_API_URL}/api/v1/notifications/${notificationId}`,
			{
				method: 'DELETE',
			},
		);

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
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

import { NextRequest, NextResponse } from 'next/server';
import { apiProxy } from '@/src/lib/serverHelper';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const body = await request.json();

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/institutions/${id}`,
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
		console.error('Proxy error modifying institutions:', error);
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
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/institutions/${id}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (response.status === 204) {
			return NextResponse.json(
				{ message: 'Institution removal success', success: true },
				{ status: response.status },
			);
		}
		if (response.status === 404) {
			const error = await response.json();
			console.log(error);
			return NextResponse.json(
				{ message: 'Institution does not exist', success: false },
				{ status: response.status },
			);
		}

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Proxy error deleting institution:', error);
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

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/institutions/${id}`,
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
		console.error('Error fetching institution:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

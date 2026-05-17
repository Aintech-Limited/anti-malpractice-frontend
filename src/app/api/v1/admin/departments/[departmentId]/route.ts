import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { id, ...updateData } = body;

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/admins/departments/${id}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(updateData),
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

export async function DELETE(request: NextRequest) {
	try {
		const url = new URL(request.url);
		const id = url.searchParams.get('id');

		if (!id) {
			return NextResponse.json(
				{ success: false, message: 'Department ID is required' },
				{ status: 400 },
			);
		}

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/admins/departments/${id}`,
			{
				method: 'DELETE',
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

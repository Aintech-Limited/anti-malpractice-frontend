import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await apiProxy(`${BACKEND_API_URL}/v1/roles`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body),
		});

		if (!response.ok) {
			const error = await response.json();
			console.error('error: ', JSON.stringify(error));
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Failed to create role :', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}
export async function PATCH(request: NextRequest) {
	try {
		const body = await request.json();

		const { id, ...rest } = body;

		const response = await apiProxy(`${BACKEND_API_URL}/v1/roles/${id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(rest),
		});

		if (!response.ok) {
			const error = await response.json();
			console.error('error: ', JSON.stringify(error));
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Failed to modify role :', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const includePermissions = searchParams.get('includePermissions');
		const search = searchParams.get('search');
		const page = searchParams.get('page') || '1';
		const limit = searchParams.get('limit') || '50';

		const params = new URLSearchParams();

		params.append('page', page);

		params.append('limit', limit);

		if (includePermissions) {
			params.append('includePermissions', includePermissions);
		}
		if (search) {
			params.append('search', search);
		}

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/roles?${params.toString()}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error fetching roles:', error);
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

export async function deleteRole(id: string) {
	const response = await fetch(`/api/v1/roles/${id}`, {
		method: 'DELETE',
	});

	const result = await response.json();

	if (!response.ok) {
		throw new Error(result.message || 'Failed to delete role');
	}

	return result;
}

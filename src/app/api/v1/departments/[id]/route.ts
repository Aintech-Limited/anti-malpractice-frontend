import { NextRequest, NextResponse } from 'next/server';
import { apiProxy } from '@/src/lib/serverHelper';

export async function GET(
	request: NextRequest,
	params: Promise<{ id: string }>,
) {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/departments/${(await params).id}`,
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
		console.error('Error fetching department stats:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

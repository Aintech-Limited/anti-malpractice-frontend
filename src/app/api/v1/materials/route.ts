import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/courses/materials`,
			{
				method: 'GET',
				credentials: 'include',
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
		console.error('error getting materials: ', error);
		return NextResponse.json(
			{ message: 'Internal server error', success: false },
			{ status: 500 },
		);
	}
}

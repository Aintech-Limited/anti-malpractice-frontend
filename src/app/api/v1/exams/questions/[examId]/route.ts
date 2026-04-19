import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ examId: string }> },
) {
	try {
		const searchedParams = request.nextUrl.searchParams;
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/exams/questions/${(await params).examId}?${searchedParams.toString().replace('100', '50')}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-cache',
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}
		console.log(data);

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error fetching lec. exam questions:', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

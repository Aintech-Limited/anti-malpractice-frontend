import { NextRequest, NextResponse } from 'next/server';
import { apiProxy } from '@/src/lib/serverHelper';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const { provider, transactionRef, transactionId } = body;

		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/payments/verify/exam-registrations`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					provider,
					transactionRef,
					transactionId,
				}),
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error verifying exam-registrations payment:', error);
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		);
	}
}

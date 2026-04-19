import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await fetch(
			`${process.env.BACKEND_API_URL}/v1/auth/verify-password-otp`,
			{
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			},
		);

		if (!response.ok) {
			return NextResponse.json(
				{ ...(await response.json()) },
				{ status: response.status },
			);
		}
		const data = await response.json();

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('error verify-password-otp: ', error);
		return NextResponse.json(
			{ message: 'Internal server error', success: false },
			{ status: 500 },
		);
	}
}

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await fetch(
			`${process.env.BACKEND_API_URL}/v1/news-letter`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			},
		);

		const data = await response.json();

		if (!response.ok) {
			console.error('error: ', JSON.stringify(data));
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error subscribing to newsletter:', error);
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		);
	}
}

export async function PATCH(request: NextRequest) {
	try {
		const body = await request.json();

		const response = await fetch(
			`${process.env.BACKEND_API_URL}/v1/news-letter/unsubscribe`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body as {email: string; reason?: string}),
			},
		);

		const data = await response.json();

		if (!response.ok) {
			console.error('error: ', JSON.stringify(data));
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error unsubscribing to newsletter:', error);
		return NextResponse.json(
			{ success: false, message: 'Internal server error' },
			{ status: 500 },
		);
	}
}

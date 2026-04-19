import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
	try {
		const registeredCourseId = (await request.json()).registeredCourseId;

		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course/registrations/drop/${registeredCourseId}`,
			{
				method: 'PATCH',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			const error = await response.json();
			console.error('error: ', JSON.stringify(error));
			return NextResponse.json(error, { status: response.status });
		}

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Error dropping course :', error);
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		);
	}
}

import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const searchParams = request.nextUrl.searchParams;
		const unassigned = searchParams.get('unassigned');

		if (unassigned) {
			const { courseId, lecturerId, assignmentId } = body;
			const response = await apiProxy(
				`${process.env.BACKEND_URL}/v1/admins/courses/${courseId}/assignments/unassign`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({ lecturerId, assignmentId }),
				},
			);

			const data = await response.json();
			return NextResponse.json(data, { status: response.status });
		}
		const { courseId, ...payload } = body;
		console.log('payload: ', payload, ', courseId: ', courseId);

		const response = await apiProxy(
			`${process.env.BACKEND_URL}/v1/admins/courses/${courseId}/assignments`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(payload),
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

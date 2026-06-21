import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function GET(request: NextRequest) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const page = searchParams.get('page') || '1';
		const limit = searchParams.get('limit') || '10';
		const search = searchParams.get('search') || '';
		const departmentId = searchParams.get('departmentId') || '';
		const isActive = searchParams.get('isActive');
		const idVerified = searchParams.get('idVerified');
		const selfieVerified = searchParams.get('selfieVerified');

		const queryParams = new URLSearchParams();
		queryParams.append('page', page);
		queryParams.append('limit', limit);
		if (search) queryParams.append('search', search);
		if (departmentId) queryParams.append('departmentId', departmentId);
		if (isActive) queryParams.append('isActive', isActive);
		if (idVerified) queryParams.append('idVerified', idVerified);
		if (selfieVerified) queryParams.append('selfieVerified', selfieVerified);

		const response = await apiProxy(
			`${BACKEND_API_URL}/v1/admins/lecturers?${queryParams.toString()}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		const data = await response.json();
		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('Proxy error:', error);
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

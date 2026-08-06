import { apiProxy } from '@/src/lib/serverHelper';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		console.log([...formData.keys()]);

		if (!formData.has('avatar')) {
			return NextResponse.json({ message: 'Missing file' }, { status: 400 });
		}

		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/uploads/avatar`,
			{
				method: 'POST',
				credentials: 'include',
				body: formData,
			},
			false,
		);

		const data = await response.json();

		if (!response.ok) {
			return NextResponse.json(data, { status: response.status });
		}

		return NextResponse.json(data, { status: response.status });
	} catch (error) {
		console.error('error uploading avatar: ', error);
		return NextResponse.json({ message: 'Upload failed' }, { status: 500 });
	}
}

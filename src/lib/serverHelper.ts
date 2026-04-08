'use server';

import { decodeJwt, JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import {
	ICourseMaterialsQuery,
	IPurchasedCourseMaterialsResponse,
} from '../components/Dashboard/Student/CourseMaterial/interface';
import { RegisteredCoursesResponse } from '../components/Dashboard/Student/RegisteredCourses/interface';
import { ISupportArticlesReponse } from '../components/Support/interface';
import { ICoursesCatalogQuery } from '../components/Dashboard/Student/CoursesCatalog/interface';
import {
	IPaymentApiResponse,
	IPaymentsPageProps,
} from '../components/Dashboard/Student/Payments/interface';
import { IDepartmentsPageProps } from '../components/Dashboard/Department/interface';

/**
 * Get JWT header without verification
 * @param {string} token - The JWT token
 * @returns {Object} - The decoded header
 */
export async function decodeMyJwt(
	token: string,
): Promise<JWTPayload & { profileType: string }> {
	try {
		return decodeJwt(token) as JWTPayload & { profileType: string };
	} catch (error) {
		throw new Error(`Failed to decode header: ${(error as Error).message}`);
	}
}

export async function fetchSupportArticles(): Promise<ISupportArticlesReponse> {
	try {
		const cookieStore = await cookies();

		const response = await fetch(
			`${process.env.BACKEND_API_URL}/v1/support/articles`,
			{
				headers: {
					'Content-Type': 'application/json',
					Cookie: cookieStore.toString(),
				},
				cache: 'no-store',
			},
		);

		if (!response.ok) {
			throw new Error('Failed to fetch articles');
		}

		const data = await response.json();
		return data.data;
	} catch (error) {
		console.error('Error fetching articles:', error);
		return {
			message: 'Error fetching articles',
			success: false,
			data: { articles: [], categories: [] },
		};
	}
}

export const getCourseMaterials = async () => {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course-materials`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);

		if (!response.ok) return [];
		const data = await response.json();
		return data.data as any[];
	} catch (error) {
		console.error('error fetching materials: ', error);
		throw error;
	}
};
export const getCourses = async (query: ICoursesCatalogQuery) => {
	try {
		let queryParams = `?limit=${query.limit}&page=${query.page}`;
		if (query.search) {
			queryParams += `&search=${query.search}`;
		}
		if (query.searchCode) {
			queryParams += `&searchCode=${query.searchCode}`;
		}
		if (query.sortBy) {
			queryParams += `&sortBy=${query.sortBy}`;
		}
		if (query.sortOrder) {
			queryParams += `&sortOrder=${query.sortOrder}`;
		}
		if (query.status) {
			queryParams += `&status=${query.status}`;
		}
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/courses${queryParams}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: { cookie: (await cookies()).toString() },
			},
		);

		if (!response.ok) {
			const data = await response.json();
			console.log(data);
			return {
				message: data?.message,
				success: false,
				meta: { page: 1, limit: 50, totalItems: 1, totalPages: 1 },
				data: [],
			};
		}
		const data = (await response.json()) as {
			message: string;
			success: boolean;
			meta: {
				page: number;
				limit: number;
				totalItems: number;
				totalPages: number;
			};
			data: any[];
		};
		return data.data;
	} catch (error) {
		console.error('error fetching materials: ', error);
		return [];
	}
};

export const getPurchasedCourseMaterials = async (
	query: ICourseMaterialsQuery,
) => {
	try {
		const queries = `?page=${query?.page ?? 1}&limit=${query?.limit ?? 20}&stats=${typeof query?.stats === 'undefined' ? false : query.stats}&sortBy=${query?.sort ?? 'createdAt'}`;
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/purchased-materials${queries}`,
			{
				method: 'GET',
				credentials: 'include',
			},
		);

		if (!response.ok) {
			if (response.headers.get('content-type') === 'application/json') {
				return (await response.json()) as IPurchasedCourseMaterialsResponse;
			}
			return JSON.parse(
				await response.text(),
			) as IPurchasedCourseMaterialsResponse;
		}
		const data = (await response.json()) as IPurchasedCourseMaterialsResponse;
		return data;
	} catch (error) {
		console.error('error fetching materials: ', error);
		throw error;
	}
};
export async function fetchRegisteredCourses(): Promise<RegisteredCoursesResponse> {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/course/registrations`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch registered courses: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		console.error('Error fetching registered courses:', error);
		return {
			success: false,
			message: 'Failed to load registered courses',
			meta: {
				hasNextPage: false,
				hasPreviousPage: false,
				limit: 20,
				page: 1,
				totalItems: 0,
				totalPages: 1,
			},
			data: [],
		};
	}
}

export async function fetchPayments(
	searchParams: IPaymentsPageProps['searchParams'],
): Promise<IPaymentApiResponse> {
	const page = (await searchParams).page || '1';
	const limit = (await searchParams).limit || '50';
	const type = (await searchParams).type || '';
	const sortBy = (await searchParams).sortBy || 'createdAt';

	let url = `payments?page=${page}&limit=${limit}&sortBy=${sortBy}`;
	if (type) {
		url += `&type=${type}`;
	}

	const response = await apiProxy(`${process.env.BACKEND_API_URL}/v1/${url}`, {
		next: { revalidate: 60 }, // Revalidate every 60 seconds
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Failed to fetch payments');
	}

	return response.json() as unknown as IPaymentApiResponse;
}

export async function getUserProfile() {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/users/me`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			},
		);

		return response.json();
	} catch (error) {
		console.error('error getting user data: ', error);
		return {
			message: 'Failed to fetch user profile',
			success: false,
			data: {},
		};
	}
}

export async function fetchDepartments(
	searchParams: IDepartmentsPageProps['searchParams'],
) {
	const page = (await searchParams).page || '1';
	const limit = (await searchParams).limit || '10';
	const sortBy = (await searchParams).sortBy || 'createdAt';
	const name = (await searchParams).name || '';

	let url = `v1/departments?page=${page}&limit=${limit}&sortBy=${sortBy}`;
	if (name) {
		url += `&name=${encodeURIComponent(name)}`;
	}

	const response = await apiProxy(`${process.env.BACKEND_API_URL}/${url}`, {
		cache: 'no-store',
	});

	if (!response.ok) {
		throw new Error('Failed to fetch departments');
	}

	return response.json();
}

export async function fetchAccounts() {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/accounts`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			},
		);

		return response.json();
	} catch (error) {
		console.error(error);
		return { data: [] };
	}
}

export async function fetchBankList() {
	try {
		const response = await apiProxy(
			`${process.env.BACKEND_API_URL}/v1/accounts/banklist`,
			{
				cache: 'no-store',
			},
		);

		return response.json();
	} catch (error) {
		return { data: [], message: 'Failed to fetch bank list', success: false };
	}
}

export const apiProxy = async (
	input: RequestInfo | URL,
	init?: RequestInit,
) => {
	const cookie = await cookies();
	// console.log('cookie: ', cookie);
	const makeRequest = async (
		requestInput: RequestInfo | URL,
		requestInit?: RequestInit,
	) => {
		return fetch(requestInput, {
			...requestInit,
			headers: {
				'Content-Type': 'application/json',
				Cookie: (await cookies()).toString(),
				...requestInit?.headers,
			},
		});
	};

	try {
		let initResponse = await makeRequest(input, init);

		if (initResponse.status === 401) {
			const refreshResponse = await fetch(
				`${process.env.BACKEND_API_URL}/v1/auth/refresh`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json',
						Cookie: cookieStore.toString(),
					},
				},
			);

			if (!refreshResponse.ok) {
				if (refreshResponse.status === 401) {
					return new Response('Unauthorized', { status: 401 });
				}
				return new Response(await refreshResponse.json(), {
					status: refreshResponse.status,
				});
			}
			const newCookies = refreshResponse.headers.getSetCookie();
			// console.log('newCookies: ', newCookies);

			const refreshData = await refreshResponse.json();
			// console.log('refreshData: ', refreshData);

			initResponse = await makeRequest(input, {
				...init,
				headers: { ...init?.headers, Cookie: newCookies.toString() },
			});
		}

		return initResponse;
	} catch (error) {
		console.error('error: ', error);
		throw error;
	}
};

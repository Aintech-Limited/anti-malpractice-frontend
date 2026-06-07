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
import { IExamsPageProps } from '../components/Dashboard/Lecturer/Exams/interface';
import { IIExamRegistrationsPageProps } from '../components/Dashboard/Lecturer/Exams/ExamRegistrations/interface';
import {
	ICourseMaterialsPageProps,
	IMaterialsApiResponse,
} from '../components/Dashboard/Lecturer/CourseMaterials/interface';
import { IRegisteredExamsPageProps } from '../components/Dashboard/Student/RegisteredExam/interface';
import { IExamRegistrationPageProps } from '../components/Dashboard/Student/ExamRegistration/interface';
import { IStudentDashboardResponse } from '../components/Dashboard/Student/interface';
import { ILiveExamDetailResponse } from '../components/Dashboard/Student/ExamChart/LiveExamDetail/interface';
import {
	IBlockUnblockResponse,
	IDepartmentStudentsResponse,
	ISendEmailResponse,
} from '../components/Dashboard/Admin/Departments/Students/interface';
import { IDepartmentsResponse } from '../components/Dashboard/Admin/Departments/interface';
import {
	ICourseFilters,
	ICoursesResponse,
} from '../components/Dashboard/Admin/Departments/Courses/interface';
import {
	IStudentFilters,
	IStudentsResponse,
} from '../components/Dashboard/Admin/Departments/Courses/Students/interface';
import {
	ILecturerAssignment,
	ILecturerCourse,
	ILecturerFilters,
	ILecturersResponse,
} from '../components/Dashboard/Admin/Lecturers/interface';
import {
	IAdminExamCourse,
	IAdminExamDepartment,
	IAdminExamFilters,
	IAdminExamFullDetails,
	IAdminExamsResponse,
} from '../components/Dashboard/Admin/Exams/interface';
import {
	IAdminDashboardProps,
	IAdminDashboardResponse,
} from '../components/Dashboard/Admin/interface';
import { ProtectedRouteEnum, TEmailTemplateEnum } from './enums';
import { IUserModel } from '../types/user';
import {
	IBulkGradeRequest,
	IGetUngradedQuestionResponse,
	IUngradedQuestion,
} from '../components/Dashboard/Lecturer/GradeExam/interface';
import { revalidatePath } from 'next/cache';
import { ILecturerDashboardResponse } from '../components/Dashboard/Lecturer/interface';

const API_BASE_URL = process.env.BACKEND_API_URL;
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
		const response = await apiProxy(`${API_BASE_URL}/v1/support/articles`, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

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
		const response = await apiProxy(`${API_BASE_URL}/v1/course-materials`, {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		});

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
		const token = (await cookies()).get(process.env.AUTH_TOKEN_NAME)?.value;
		const decodedToken = await decodeMyJwt(token!);

		const url =
			decodedToken.role === 'USER'
				? `v1/courses${queryParams}`
				: decodedToken.role === 'STAFF'
					? `v1/courses/staff${queryParams}`
					: `v1/courses/admin${queryParams}`;
		const response = await apiProxy(`${API_BASE_URL}/${url}`, {
			method: 'GET',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
		});

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
		return data;
	} catch (error) {
		console.error('error fetching materials: ', error);
		return {
			message: 'Internal Server error',
			data: [],
			success: false,
			meta: { page: 1, limit: 50, totalItems: 1, totalPages: 1 },
		};
	}
};

export const getPurchasedCourseMaterials = async (
	query: ICourseMaterialsQuery,
) => {
	try {
		const queries = `?page=${query?.page ?? 1}&limit=${query?.limit ?? 20}&stats=${typeof query?.stats === 'undefined' ? false : query.stats}&sortBy=${query?.sort ?? 'createdAt'}`;
		const response = await apiProxy(
			`${API_BASE_URL}/v1/purchased-materials${queries}`,
			{
				method: 'GET',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
			},
		);

		if (!response.ok) {
			if (response.headers.get('content-type') === 'application/json') {
				return (await response.json()) as IPurchasedCourseMaterialsResponse;
			}
			return {
				success: false,
				data: {
					stats: { total: 0, completed: 0, wishlist: 0, inProgress: 0 },
					materials: [],
				},
				message: 'Error occurred',
				meta: {
					page: 1,
					limit: 50,
					totalItems: 0,
					totalPages: 1,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			};
			// return JSON.parse(
			// await response.text(),
			// ) as IPurchasedCourseMaterialsResponse;
		}
		const data = (await response.json()) as IPurchasedCourseMaterialsResponse;
		return data;
	} catch (error) {
		console.error('error fetching materials: ', error);
		return {
			success: false,
			data: {
				stats: { total: 0, completed: 0, wishlist: 0, inProgress: 0 },
				materials: [],
			},
			message: 'Error occurred',
			meta: {
				page: 1,
				limit: 50,
				totalItems: 0,
				totalPages: 1,
				hasNextPage: false,
				hasPreviousPage: false,
			},
		};
	}
};
export async function fetchRegisteredCourses(): Promise<RegisteredCoursesResponse> {
	try {
		const response = await apiProxy(`${API_BASE_URL}/v1/course/registrations`, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

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

	const response = await apiProxy(`${API_BASE_URL}/v1/${url}`, {
		next: { revalidate: 60 }, // Revalidate every 60 seconds
		credentials: 'include',
		headers: { 'Content-Type': 'application/json' },
	});

	if (!response.ok) {
		throw new Error('Failed to fetch payments');
	}

	return response.json() as unknown as IPaymentApiResponse;
}

export async function getUserProfile(): Promise<{
	data: IUserModel;
	message: string;
	success: boolean;
}> {
	try {
		const response = await apiProxy(`${API_BASE_URL}/v1/users/me`, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		return await response.json();
	} catch (error) {
		console.error('error getting user data: ', error);
		throw error;
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

	const response = await apiProxy(`${API_BASE_URL}/${url}`, {
		cache: 'no-store',
		headers: { 'Content-Type': 'application/json' },
	});

	if (!response.ok) {
		throw new Error('Failed to fetch departments');
	}

	return response.json();
}

export async function fetchAccounts() {
	try {
		const response = await apiProxy(`${API_BASE_URL}/v1/accounts`, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		return response.json();
	} catch (error) {
		console.error(error);
		return { data: [] };
	}
}

export async function fetchBankList() {
	try {
		const response = await apiProxy(`${API_BASE_URL}/v1/accounts/banklist`, {
			cache: 'no-store',
			headers: { 'Content-Type': 'application/json' },
		});

		return response.json();
	} catch (error) {
		return { data: [], message: 'Failed to fetch bank list', success: false };
	}
}

export async function fetchExams(
	searchParams: IExamsPageProps['searchParams'],
) {
	const page = (await searchParams).page || '1';
	const limit = (await searchParams).limit || '10';
	const status = (await searchParams).status || '';
	const type_ = (await searchParams).type_ || '';
	const sortBy = (await searchParams).sortBy || 'createdAt';
	const sortOrder = (await searchParams).sortOrder || 'DESC';
	const published = (await searchParams).published;
	try {
		let url = `${API_BASE_URL}/v1/exams?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
		if (status) url += `&status=${status}`;
		if (type_) url += `&type_=${type_}`;
		if (published) url += `&published=${published}`;

		const response = await apiProxy(url, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			return data;
		}

		return data;
	} catch (error) {
		console.error(error);
		return {
			data: [],
			success: false,
			message: 'Internal Server error',
			meta: { page, limit },
		};
	}
}

export async function fetchCourseAssignments() {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/course-assignments/staff?status=ACTIVE&page=1&limit=50&sortBy=assignedAt&sortOrder=asc`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return data;
		}

		return data;
	} catch (error) {
		console.error(error);
		return { data: [], success: false, message: 'Internal Server Error' };
	}
}

export async function fetchExamRegistrations(
	examId: string,
	searchParams: IIExamRegistrationsPageProps['searchParams'],
) {
	const page = (await searchParams).page || '1';
	const limit = (await searchParams).limit || '20';
	const sortBy = (await searchParams).sortBy || 'registeredAt';
	const sortOrder = (await searchParams).sortOrder || 'DESC';
	const status = (await searchParams).status || '';
	const level = (await searchParams).level || '';
	const semester = (await searchParams).semester || '';

	let url = `${API_BASE_URL}/v1/exam-registrations/${examId}?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
	if (status) url += `&registrationStatus=${status}`;
	if (level) url += `&level=${level}`;
	if (semester) url += `&semester=${semester}`;

	try {
		const response = await apiProxy(url, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			return data ?? { data: [], message: 'An Error occured', success: false };
		}

		return data;
	} catch (error) {
		console.error(error);
		return { data: [], message: 'Internal Sserver Error', success: false };
	}
}

export async function fetchExamDetails(examId: string) {
	try {
		const response = await apiProxy(`${API_BASE_URL}/v1/exams/${examId}`, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			return null;
		}

		return data;
	} catch (error) {
		console.error(error);
		return { message: 'Internal Server Error', data: null, success: false };
	}
}

export async function fetchCourseMaterials(
	searchParams: ICourseMaterialsPageProps['searchParams'],
): Promise<IMaterialsApiResponse> {
	try {
		const page = (await searchParams).page || '1';
		const limit = (await searchParams).limit || '10';
		const sortBy = (await searchParams).sortBy || 'createdAt';
		const sortOrder = (await searchParams).sortOrder || 'DESC';
		const fileType = (await searchParams).fileType || '';
		const isFree = (await searchParams).isFree || '';
		const search = (await searchParams).search || '';

		let url = `${API_BASE_URL}/v1/course-materials?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
		if (fileType) url += `&fileType=${fileType}`;
		if (isFree) url += `&isFree=${isFree}`;
		if (search) url += `&search=${encodeURIComponent(search)}`;

		const response = await apiProxy(url, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			return {
				...data,
				message: 'Internal Server error',
				data: { materials: [], totalRevenue: 0 },
				success: false,
				meta: {
					page: 0,
					limit: 0,
					totalItems: 0,
					totalPages: 0,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			};
		}
		console.log('total revenue: ', data?.data?.totalRevenue);

		return data;
	} catch (error) {
		console.error(error);
		return {
			message: 'Internal Server error',
			data: { materials: [], totalRevenue: 0 },
			success: false,
			meta: {
				page: 0,
				limit: 0,
				totalItems: 0,
				totalPages: 0,
				hasNextPage: false,
				hasPreviousPage: false,
			},
		};
	}
}

export async function fetchAssignedCourses() {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/course-assignments/staff?page=1&limit=100&sortBy=assignedAt&sortOrder=asc`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return data;
		}

		return data;
	} catch (error) {
		console.error(error);
		return { message: 'Internal Server error', data: [], success: false };
	}
}

export async function fetchRegisteredExams(
	searchParams: IRegisteredExamsPageProps['searchParams'],
) {
	const page = (await searchParams).page || '1';
	const limit = (await searchParams).limit || '20';
	const sortBy = (await searchParams).sortBy || 'registeredAt';
	const sortOrder = (await searchParams).sortOrder || 'DESC';
	const status = (await searchParams).status || '';

	let url = `${API_BASE_URL}/v1/exam-registrations?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
	if (status) url += `&status=${status}`;

	try {
		const response = await apiProxy(url, {
			headers: {
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		});

		const data = await response.json();

		if (!response.ok) {
			return data;
		}

		return data;
	} catch (error) {
		console.error(error);
		return {
			message: 'Internal server error',
			success: false,
			data: [],
			meta: { page, limit, sortBy, sortOrder, status },
		};
	}
}

export async function fetchStudentsExamsRegistration(
	searchParams: IExamRegistrationPageProps['searchParams'],
) {
	const page = (await searchParams).page || '1';
	const limit = (await searchParams).limit || '50';
	let status = (await searchParams).status;
	if (status) {
		if (!['UPCOMING', 'ENDED', 'STARTED'].includes(status)) {
			status = undefined;
		}
	}
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/exams/students/registration?page=${page}&limit=${limit}&sortBy=createdAt${status ? `&status=${status}` : ''}`,
			{
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				cache: 'no-store',
			},
		);

		const data = await response.json();

		if (!response.ok) {
			return data;
		}

		return data;
	} catch (error) {
		return {
			message: 'Internal server error',
			success: false,
			data: [],
			meta: { page, limit, status },
		};
	}
}

export const fetchStudentLiveExam = async (examId: string) => {
	try {
		const response = await apiProxy(`${API_BASE_URL}/v1/exams/${examId}`, {
			method: 'GET',
			credentials: 'include',
		});
		if (!response.ok) {
			const error = await response.json();
			return error;
		}
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('error fetching live exam: ', error);
		return { message: 'Internal Server Error', success: false, data: {} };
	}
};

export const fetchStudentDashboard =
	async (): Promise<IStudentDashboardResponse> => {
		try {
			const response = await apiProxy(`${API_BASE_URL}/v1/dashboard/students`, {
				method: 'GET',
				credentials: 'include',
			});
			if (!response.ok) {
				const error = await response.json();
				return error;
			}
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('error fetching student dashboard: ', error);
			return {
				message: 'Internal Server Error',
				success: false,
				data: {
					liveExams: [],
					results: [],
					stats: [],
					upcomingExamsThisWeek: [],
					upcomingExamsToday: [],
				},
			};
		}
	};

export const fetchLiveExamDetails = async (
	examId: string,
): Promise<ILiveExamDetailResponse> => {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/exams/students/live/details/${examId}`,
			{ method: 'GET', credentials: 'include' },
		);
		if (!response.ok) {
			const error = await response.json();
			console.log('error: ', JSON.stringify(error), ', examId: ', examId);
			return error;
		}
		const data = await response.json();
		return {
			data: data.data,
			statusCode: response.status,
			message: data.message,
			success: data.success,
		};
	} catch (error) {
		console.error('error fetching live exam details:', error);
		throw error;
	}
};

export async function fetchDepartmentalStudents(
	departmentId: string,
	page: number = 1,
	limit: number = 10,
): Promise<IDepartmentStudentsResponse> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/departments/${departmentId}/students?&page=${page}&limit=${limit}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch students: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching students:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch students',
			meta: {
				page: 1,
				limit: limit,
				hasNextPage: false,
				hasPreviousPage: false,
			},
			data: [],
		};
	}
}

export async function blockStudent(
	studentId: string,
): Promise<IBlockUnblockResponse> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/students/block`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ studentId, block: true }),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			console.error(error);
			return error;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error blocking student:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to block student',
		};
	}
}

export async function unblockStudent(
	studentId: string,
): Promise<IBlockUnblockResponse> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/students/block`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ studentId, block: false }),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			console.error(error);
			return error;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error unblocking student:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to unblock student',
		};
	}
}

export async function sendEmailToStudent(
	studentEmail: string,
	emailType: TEmailTemplateEnum,
	departmentId: string,
	customMessage?: string,
): Promise<ISendEmailResponse> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/students/send-email`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					studentEmail,
					emailType,
					departmentId,
					customMessage,
				}),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			console.error(error);
			return error;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error sending email:', error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to send email',
		};
	}
}

export async function fetchAdminDepartments(
	page: number = 1,
	limit: number = 20,
): Promise<IDepartmentsResponse> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/departments?page=${page}&limit=${limit}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			const data = await response.json();
			return data;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching departments:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch departments',
			meta: {
				page: 1,
				limit: limit,
				hasNextPage: false,
				hasPreviousPage: false,
				totalItems: 0,
				totalPages: 1,
			},
			data: [],
		};
	}
}

export async function fetchAdminDepartmentCourses(
	departmentId: string,
	filters: ICourseFilters,
): Promise<ICoursesResponse> {
	try {
		const params = new URLSearchParams();
		params.append('page', String(filters.page || 1));
		params.append('limit', String(filters.limit || 10));
		if (filters.creditHours)
			params.append('creditHours', String(filters.creditHours));
		if (filters.semester) params.append('semester', String(filters.semester));
		if (filters.level) params.append('level', String(filters.level));
		if (filters.status) params.append('status', filters.status);

		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/departments/${departmentId}/courses?${params.toString()}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch courses: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching courses:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch courses',
			meta: {
				page: 1,
				limit: 10,
				hasNextPage: false,
				hasPreviousPage: false,
				totalItems: 0,
				totalPages: 1,
			},
			data: [],
		};
	}
}

export async function fetchAdminCourseStudents(
	courseId: string,
	filters: IStudentFilters,
): Promise<IStudentsResponse> {
	try {
		const params = new URLSearchParams();
		params.append('page', String(filters.page || 1));
		params.append('limit', String(filters.limit || 10));
		if (filters.search) params.append('search', filters.search);
		if (filters.faceAuthEnabled !== undefined)
			params.append('faceAuthEnabled', String(filters.faceAuthEnabled));
		if (filters.isBlocked !== undefined)
			params.append('isBlocked', String(filters.isBlocked));
		if (filters.emailVerified !== undefined)
			params.append('emailVerified', String(filters.emailVerified));
		if (filters.level) params.append('level', String(filters.level));

		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/courses/${courseId}/students?${params.toString()}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch students: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching course students:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch students',
			meta: {
				page: 1,
				limit: 10,
				totalItems: 0,
				totalPages: 1,
				hasNextPage: false,
				hasPreviousPage: false,
			},
			data: [],
		};
	}
}

export async function fetchAdminCourseInfo(
	courseId: string,
): Promise<{ success: boolean; data?: any; message?: string }> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/courses/${courseId}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch course info: ${response.statusText}`);
		}

		const data = await response.json();
		return { success: true, data: data.data };
	} catch (error) {
		console.error('Error fetching course info:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch course info',
		};
	}
}

export async function fetchAdminLecturers(
	filters: ILecturerFilters,
): Promise<ILecturersResponse> {
	try {
		const params = new URLSearchParams();
		params.append('page', String(filters.page || 1));
		params.append('limit', String(filters.limit || 10));
		if (filters.search) params.append('search', filters.search);
		if (filters.departmentId)
			params.append('departmentId', filters.departmentId);
		if (filters.isActive !== undefined)
			params.append('isActive', String(filters.isActive));
		if (filters.idVerified !== undefined)
			params.append('idVerified', String(filters.idVerified));
		if (filters.selfieVerified !== undefined)
			params.append('selfieVerified', String(filters.selfieVerified));

		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/lecturers?${params.toString()}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch lecturers: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching lecturers:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch lecturers',
			meta: {
				page: 1,
				limit: 10,
				totalItems: 0,
				totalPages: 1,
				hasNextPage: false,
				hasPreviousPage: false,
			},
			data: [],
		};
	}
}

export async function fetchAvailableCourses(
	departmentId?: string,
): Promise<ILecturerCourse[]> {
	try {
		const params = new URLSearchParams();
		if (departmentId) params.append('departmentId', departmentId);

		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/courses?${params.toString()}`,
			{ cache: 'no-store' },
		);
		const data = await response.json();
		return data.success ? data.data : [];
	} catch (error) {
		console.error('Error fetching courses:', error);
		return [];
	}
}

export async function fetchLecturerAssignments(
	lecturerId: string,
): Promise<ILecturerAssignment[]> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/lecturers/${lecturerId}/assignments`,
			{ cache: 'no-store' },
		);
		const data = await response.json();
		return data.success ? data.data : [];
	} catch (error) {
		console.error('Error fetching assignments:', error);
		return [];
	}
}

export async function fetchAdminExams(
	filters: IAdminExamFilters,
): Promise<IAdminExamsResponse> {
	try {
		const params = new URLSearchParams();
		params.append('page', String(filters.page || 1));
		params.append('limit', String(filters.limit || 20));
		if (filters.search) params.append('search', filters.search);
		if (filters.adminStatus) params.append('adminStatus', filters.adminStatus);
		if (filters.type_) params.append('type_', filters.type_);
		if (filters.departmentId)
			params.append('departmentId', filters.departmentId);
		if (filters.courseId) params.append('courseId', filters.courseId);
		if (filters.published !== undefined)
			params.append('published', String(filters.published));
		if (filters.startDate) params.append('startDate', filters.startDate);
		if (filters.endDate) params.append('endDate', filters.endDate);

		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/exams?${params.toString()}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch exams: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching exams:', error);
		return {
			success: false,
			message: error instanceof Error ? error.message : 'Failed to fetch exams',
			page: 1,
			limit: 10,
			total: 0,
			hasNextPage: false,
			hasPreviousPage: false,
			data: [],
		};
	}
}

export async function fetchAdminExamDetails(examId: string): Promise<{
	success: boolean;
	data?: IAdminExamFullDetails;
	message?: string;
}> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/admins/exams/${examId}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch exam details: ${response.statusText}`);
		}

		const data = await response.json();
		return { success: true, data: data.data };
	} catch (error) {
		console.error('Error fetching exam details:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch exam details',
		};
	}
}

export async function fetchAdminDashboard(): Promise<IAdminDashboardResponse> {
	try {
		const response = await apiProxy(`${API_BASE_URL}/v1/dashboard/a/admins`, {
			cache: 'no-store',
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching courses:', error);
		return {
			message: 'Failed to fetch Dashboard data',
			success: false,
			data: {
				examStats: [],
				lecturerStats: [],
				notifications: [],
			},
		};
	}
}

export async function fetchAdminDeptSelect() {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/departments/admins/select`,
			{
				cache: 'force-cache',
			},
		);
		const data = await response.json();
		return data.success ? data.data : [];
	} catch (error) {
		console.error('Error fetching admin dept select:', error);
		return [];
	}
}

export async function fetchAdminCourseSelect() {
	try {
		const response = await apiProxy(`${API_BASE_URL}/v1/courses/staff/select`, {
			cache: 'force-cache',
		});
		const data = await response.json();
		return data.success ? data.data : [];
	} catch (error) {
		console.error('Error fetching admin courses select:', error);
		return [];
	}
}

export async function fetchAdminCourses(
	departmentId?: string,
): Promise<IAdminExamCourse[]> {
	try {
		const params = new URLSearchParams();
		params.append('limit', '100');
		if (departmentId) params.append('departmentId', departmentId);

		const response = await apiProxy(
			`${API_BASE_URL}/v1/courses/staff?${params.toString()}`,
			{ cache: 'no-store' },
		);
		const data = await response.json();
		return data.success ? data.data : [];
	} catch (error) {
		console.error('Error fetching courses:', error);
		return [];
	}
}

export async function fetchAdminExamDepartments(): Promise<
	IAdminExamDepartment[]
> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/departments/admins/select?limit=50`,
			{
				cache: 'no-store',
			},
		);
		const data = await response.json();
		return data.success ? data.data : [];
	} catch (error) {
		console.error('Error fetching departments:', error);
		return [];
	}
}

export async function getUngradedQuestions(
	examId: string,
	page: number = 1,
	limit: number = 50,
): Promise<IGetUngradedQuestionResponse> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/question-answers/ungraded-questions/${examId}?page=${page}&limit=${limit}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			if (response.status < 500) {
				const error = await response.json();
				return {
					...error,
					data: {
						question: {},
						asnwers: [],
						summary: {
							total: 0,
							gradedSoFar: 0,
							remainingToGrade: 0,
						},
					},
					meta: {
						page: 1,
						limit: 50,
						totalItems: 0,
						totalPages: 0,
						hasNextPage: false,
						haxPreviousPage: false,
					},
				};
			}
			throw new Error(
				`Failed to fetch ungraded questions: ${response.statusText}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching ungraded questions:', error);
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Failed to fetch ungraded questions',
			data: {
				ungradedQuestions: [],
				examTitle: 'Grading Exam',
			},
			meta: {
				page: 1,
				limit: 50,
				totalItems: 0,
				totalPages: 0,
				hasNextPage: false,
				hasPreviousPage: false,
			},
		};
	}
}

export async function getUngradedAnswers(
	examId: string,
	questionId: string,
	page: number = 1,
	limit: number = 20,
) {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/question-answers/ungraded-answers?examId=${examId}&questionId=${questionId}&page=${page}&limit=${limit}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			if (response.status < 500) {
				const error = await response.json();
				return {
					...error,
					data: null,
					meta: {
						page: 1,
						limit: 20,
						totalItems: 0,
						totalPages: 0,
						hasNextPage: false,
						haxPreviousPage: false,
					},
				};
			}
			throw new Error(
				`Failed to fetch ungraded answers: ${response.statusText}`,
			);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching ungraded answers:', error);
		return {
			success: false,
			message:
				error instanceof Error
					? error.message
					: 'Failed to fetch ungraded answers',
			data: null,
			meta: {
				page: 1,
				limit: 20,
				totalItems: 0,
				totalPages: 0,
				hasNextPage: false,
				haxPreviousPage: false,
			},
		};
	}
}

export async function bulkGradeAnswers(request: IBulkGradeRequest) {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/question-answers/bulk-grade`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(request),
			},
		);

		if (!response.ok) {
			if (response.status < 500) {
				const error = await response.json();
				return { ...error, data: null };
			}

			throw new Error('Internal Server Error.');
		}

		const data = await response.json();

		// Revalidate the page to show updated data
		revalidatePath(
			ProtectedRouteEnum.LECTURERS + `/grade-exams/${request.examId}/grade`,
		);

		return data;
	} catch (error) {
		console.error('Error bulk grading:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to grade answers',
		};
	}
}

export async function getGradingProgress(examId: string) {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/question-answers/progress/${examId}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			if (response.status < 500) {
				const data = await response.json();
				return data;
			}
			throw new Error('Internal Server Error');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching progress:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch progress',
			data: null,
		};
	}
}

export async function fetchDashboard(
	lecturerId: string,
): Promise<ILecturerDashboardResponse> {
	try {
		const response = await apiProxy(
			`${API_BASE_URL}/v1/dashboard/staff/lectuers/${lecturerId}`,
			{
				cache: 'no-store',
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		if (!response.ok) {
			if (response.status < 500) {
				const data = await response.json();
				return data;
			}
			throw new Error('Internal Server Error');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching progress:', error);
		return {
			success: false,
			message:
				error instanceof Error ? error.message : 'Failed to fetch progress',
			data: {
				stats: {
					totalExams: 0,
					completedExams: 0,
					needsApproval: 0,
					liveExams: 0,
					upcomingExams: 0,
				},
				recentNotifications: [],
			},
		};
	}
}

export const apiProxy = async (
	input: RequestInfo | URL,
	init?: RequestInit,
) => {
	const cookie = await cookies();
	// console.log('cookie: ', cookie.toString());
	const makeRequest = async (
		requestInput: RequestInfo | URL,
		requestInit?: RequestInit,
	) => {
		return fetch(requestInput, {
			...requestInit,
			headers: {
				Cookie: cookie.toString(),
				// Cookie: `${process.env.AUTH_TOKEN_NAME}=${cookie.get(process.env.AUTH_TOKEN_NAME)?.value}`,
				...requestInit?.headers,
			},
		});
	};

	try {
		let initResponse = await makeRequest(input, init);

		if (initResponse.status === 401) {
			const refreshResponse = await fetch(`${API_BASE_URL}/v1/auth/refresh`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Cookie: cookie.toString(),
					// Cookie: `${process.env.AUTH_REFRESH_TOKEN_NAME}=${cookie.get(process.env.AUTH_REFRESH_TOKEN_NAME)?.value}`,
				},
			});

			if (!refreshResponse.ok) {
				if (refreshResponse.status === 401) {
					return new Response('Unauthorized', { status: 401 });
				}
				return new Response(await refreshResponse.json(), {
					status: refreshResponse.status,
				});
			}
			const newCookies = refreshResponse.headers.getSetCookie();

			await refreshResponse.json();

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

export default async function serverAction() {
	return {
		lecturers: {
			fetchBankList,
			fetchAccounts,
			fetchRegisteredExams,
			fetchAssignedCourses,
			fetchCourseMaterials,
			fetchExamDetails,
			fetchExamRegistrations,
			fetchCourseAssignments,
			fetchExams,
			fetchDashboard,
		},
		students: {
			fetchDepartments,
			fetchRegisteredCourses,
			getPurchasedCourseMaterials,
			fetchLiveExamDetails,
			fetchStudentDashboard,
			fetchStudentLiveExam,
			fetchStudentsExamsRegistration,
		},
		common: {
			apiProxy,
			fetchDepartments,
			getUserProfile,
			fetchPayments,
			getCourses,
			getCourseMaterials,
			fetchSupportArticles,
			decodeMyJwt,
		},
		admins: {
			fetchAdminCourseInfo,
			fetchAdminCourseStudents,
			fetchAdminDepartmentCourses,
			fetchAdminDepartments,
			sendEmailToStudent,
			unblockStudent,
			blockStudent,
			fetchDepartmentalStudents,
			fetchAdminLecturers,
			fetchAvailableCourses,
			fetchLecturerAssignments,
			fetchAdminExams,
			fetchAdminExamDetails,
			fetchAdminCourses,
			fetchAdminExamDepartments,
			fetchAdminDashboard,
			fetchAdminDeptSelect,
			fetchAdminCourseSelect,
		},
	};
}

import { TMaterialType } from '../interface';

export const PAYMENT_PROVIDERS = {
	FLUTTERWAVE: 'FLUTTERWAVE',
	PAYSTACK: 'PAYSTACK',
} as const;

export const VERIFICATION_ENDPOINTS: Record<TMaterialType, string> = {
	EXAM_REGISTRATION: '/api/v1/purchase/verify/exam-registrations',
	COURSE_MATERIAL: '/api/v1/purchase/verify/course-materials',
};

export const REDIRECT_PATHS: Record<
	TMaterialType,
	(materialId: string) => string
> = {
	EXAM_REGISTRATION: (materialId: string) =>
		`/dashboard/students/exams/registered?purchased=${materialId}`,
	COURSE_MATERIAL: (materialId: string) =>
		`/dashboard/students/courses/registered?purchased=${materialId}`,
};

export const COUNTDOWN_DURATION = 8;

export const STATUS_MESSAGES = {
	VERIFYING: {
		title: 'Verifying Your Payment',
		description: 'Please wait while we confirm your transaction...',
	},
	SUCCESS: {
		title: 'Payment Successful!',
		description:
			'Your payment has been verified. You now have access to the material.',
	},
	FAILURE: {
		title: 'Verification Failed',
	},
	INVALID: {
		title: 'Invalid Request',
		description: 'Cannot confirm your transaction...',
	},
} as const;

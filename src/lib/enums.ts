export const ProfileTypeEnum = Object.freeze({
	STUDENT: 'STUDENT',
	LECTURER: 'LECTURER',
	VENDOR: 'VENDOR',
});

export type ProfileTypeEnumKey = keyof typeof ProfileTypeEnum;
export type ProfileTypeEnumValue =
	(typeof ProfileTypeEnum)[keyof typeof ProfileTypeEnum];

export const SexTypeEnum = Object.freeze({
	MALE: 'MALE',
	FEMALE: 'FEMALE',
	OTHER: 'OTHER',
});

export type SexTypeEnumKey = keyof typeof SexTypeEnum;
export type SexTypeEnumValue = (typeof SexTypeEnum)[keyof typeof SexTypeEnum];

export const PhotoIdType = Object.freeze({
	DRIVER_LICENSE: 'DRIVER_LICENSE',
	NATIONAL_ID_CARD: 'NATIONAL_ID_CARD',
	INTERNATIONAL_PASSWORT: 'INTERNATIONAL_PASSWORT',
});

export type PhotoIdTypeKey = keyof typeof PhotoIdType;
export type PhotoIdTypeValue = (typeof PhotoIdType)[keyof typeof PhotoIdType];

export const ProtectedRouteEnum = Object.freeze({
	DASHBOARD: '/dashboard',
	DASHBOARD_VERIFY: '/dashboard/verify',
	STUDENTS: '/dashboard/students',
	LECTURERS: '/dashboard/lecturers',
});

export type ProtectedRouteEnumValue =
	(typeof ProtectedRouteEnum)[keyof typeof ProtectedRouteEnum];

export const UnProtectedRouteEnum = Object.freeze({
	SIGNIN: '/signin',
	SIGNUP: '/signup',
	VERIFY: '/verify',
	FORGOT_PASSWORD: '/forgot-password',
	TERMS: '/terms',
	PRIVACY: '/privacy',
});

export type UnProtectedRouteEnumValue =
	(typeof UnProtectedRouteEnum)[keyof typeof UnProtectedRouteEnum];

export const KYC_FRONT = 'front';
export const KYC_BACK = 'back';
export const KYC_SELFIE = 'selfie';

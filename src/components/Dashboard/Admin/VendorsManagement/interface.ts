import { IMeta } from '../RolesPermissions/interface';

export interface IVendorsManagementProps {
	initialVendors: IVendor[];
	initialMeta: IMeta;
}

export interface IInstitution {
	name: string;
	email: string;
	code: string;
}

export interface IProfile {
	dob: string;
	sex: 'MALE' | 'FEMALE' | string;
}

export interface IUserRole {
	createdAt: string;
}

export interface IVendor {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	emailVerified: boolean;
	isBlocked: boolean;
	createdAt: string;
	institution: IInstitution | null;
	profile: IProfile | null;
	userRoles: IUserRole[] | null;
}

export interface IVendorApiResponse {
	message: string;
	success: boolean;
	meta: IMeta;
	data: IVendor[];
}

export interface IActionApiResponse {
	message: string;
	success: boolean;
	data: Record<string, unknown>;
}

export type TVendorStatusFilter = 'ALL' | 'APPROVED' | 'REVOKED';
export type TVendorAction = 'approve' | 'revoke' | 'remove';

export interface IActionModalState {
	isOpen: boolean;
	type: TVendorAction | null;
	vendor: IVendor | null;
}

import { ComponentType } from 'react';

export interface IUserProfile {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	faceAuthEnabled: boolean;
	role: string;
	emailVerified: boolean;
	profileType: string;
	idRecorded: boolean;
	isIdVerified: boolean;
	hasPassword: boolean;
	sex: string;
	dob: string;
	phoneContact: string;
}

export interface IProfileClientProps {
	initialUserData: IUserProfile;
}

export interface IFormData {
	firstName: string;
	lastName: string;
	dob: string;
	sex: string;
	phoneContact: string;
}

export interface IPasswordData {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface IPasswordErrors {
	oldPassword: string;
	newPassword: string;
	confirmPassword: string;
}

export interface INotification {
	type: 'success' | 'error';
	message: string;
}

export interface IInfoCardProps {
	icon: React.ComponentType<any>;
	label: string;
	value: string | boolean;
}

export interface IProfileFieldProps {
	label: string;
	value: string;
	isEditing: boolean;
	type?: 'text' | 'date' | 'select' | 'tel';
	options?: { value: string; label: string }[];
	onChange?: (value: string) => void;
	icon?: ComponentType<any>;
}

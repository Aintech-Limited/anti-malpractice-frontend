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

export interface IUserModel {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	faceAuthEnabled: boolean;
	emailVerified?: boolean | null;
	role?: 'USER' | 'STAFF';
	profileType?: 'LECTURER' | 'VENDOR' | 'STUDENT';
	idRecorded?: boolean;
	isIdVerified?: boolean;
	avatarURL?: string;
}

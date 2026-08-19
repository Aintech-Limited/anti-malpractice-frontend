export interface IUserRole {
	id: 'lecturer' | 'student';
	title: string;
	badge: string;
	tagline: string;
	description: string;
	benefits: string[];
	icon: React.ReactNode;
}

import { IDepartmentStats } from '../interface';

export const formatStudentCount = (count: number): string => {
	if (count >= 1000) {
		return `${(count / 1000).toFixed(1)}K+`;
	}
	return `${count}+`;
};

export const getRandomPlaceholderStats = (): Partial<IDepartmentStats> => ({
	students: Math.floor(Math.random() * 500) + 200,
	faculty: Math.floor(Math.random() * 30) + 15,
	courses: Math.floor(Math.random() * 50) + 30,
	researchGroups: Math.floor(Math.random() * 10) + 3,
});

export const generateEmailFromDepartment = (departmentName: string): string => {
	return `${departmentName.toLowerCase().replace(/\s/g, '.')}@university.edu`;
};

export const formatPhoneNumber = (phone: string): string => {
	// Format Nigerian phone numbers
	if (phone.startsWith('+234')) {
		return phone.replace('+234', '0');
	}
	return phone;
};

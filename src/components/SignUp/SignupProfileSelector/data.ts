import { ProfileTypeEnum } from '@/src/lib/enums';
import { IChooseProfileData } from './interface';
import { APP_NAME } from '@/src/lib/data';

export const profilesTypes: IChooseProfileData[] = [
	{
		id: 1,
		icon: 'Sun',
		text: `I'm a lecturer, i want to sell my product/service on ${APP_NAME}`,
		type: ProfileTypeEnum.LECTURER,
	},
	{
		id: 2,
		icon: 'Users',
		text: 'I am a Student, I want ...',
		type: ProfileTypeEnum.STUDENT,
	},
	{
		id: 3,
		icon: 'Handshake',
		text: 'I am an Author, I want to...',
		type: ProfileTypeEnum.VENDOR,
	},
];

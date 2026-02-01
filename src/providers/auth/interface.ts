import { IUserModel } from '@/src/types/user';

export interface IAuthContextType {
	user: IUserModel | null;
	signIn: (user: IUserModel) => void;
	loading: boolean;
	signOut: () => void;
	updateUser: (userData: Partial<IUserModel>) => void;
}

import { IAccount } from '../interface';

export interface IAccountCardProps {
	account: IAccount;
	onDelete: (account: IAccount) => void;
	onSetDefault: (account: IAccount) => void;
}

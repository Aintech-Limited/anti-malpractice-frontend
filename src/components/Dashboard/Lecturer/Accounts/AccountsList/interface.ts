import { IAccount } from '../interface';

export interface IAccountsListProps {
	accounts: IAccount[];
	onDeleteAccount: (account: IAccount) => void;
}

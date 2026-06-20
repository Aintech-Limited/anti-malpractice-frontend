import { IAccount } from '../interface';

export interface IAccountsListProps {
	accounts: IAccount[];
	onDeleteAccount: (account: IAccount) => void;
	onSetDefault: (account: IAccount) => void;
}

import { SetStateAction } from 'react';
import { IRole } from '../interface';

export interface IDeleteRoleModalProps {
	setShowDeleteConfirm: (value: SetStateAction<boolean>) => void;
	deleteTarget: IRole | null;
	handleDelete: () => Promise<void>;
	error: {
		network: string;
	};
}

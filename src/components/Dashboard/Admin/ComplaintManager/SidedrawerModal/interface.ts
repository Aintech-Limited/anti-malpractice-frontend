import { SetStateAction } from 'react';
import { IComplaintRecord, TAssigneeAdmins } from '../interface';
import { IUserModel } from '@/src/types/user';

export interface ISidedrawerModalProps {
	selectedComplaint: IComplaintRecord;
	setSelectedComplaint: (
		value: SetStateAction<IComplaintRecord | null>,
	) => void;
	handleEscalateComplaint: (
		record: IComplaintRecord,
		assignee: TAssigneeAdmins,
	) => void;
	admins: TAssigneeAdmins[];
	currentUser: IUserModel;
}

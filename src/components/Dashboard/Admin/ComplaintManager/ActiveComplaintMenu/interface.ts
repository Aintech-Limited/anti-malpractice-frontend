import { SetStateAction } from 'react';
import { IComplaintRecord } from '../interface';

export interface IActiveComplaintMenuProps {
	setActiveMenuId: (value: SetStateAction<string | null>) => void;
	setSelectedComplaint: (
		value: SetStateAction<IComplaintRecord | null>,
	) => void;
	handleAssignToMe: (record: IComplaintRecord) => Promise<void>;
	handleMarkAsResolved: (record: IComplaintRecord) => Promise<void>;
	handleSetInProgress: (record: IComplaintRecord) => Promise<void>;
	record: IComplaintRecord;
}

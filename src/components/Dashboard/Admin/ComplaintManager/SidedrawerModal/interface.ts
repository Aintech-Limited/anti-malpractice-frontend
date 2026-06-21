import { SetStateAction } from 'react';
import { IComplaintRecord } from '../interface';

export interface ISidedrawerModalProps {
	selectedComplaint: IComplaintRecord;
	setSelectedComplaint: (
		value: SetStateAction<IComplaintRecord | null>,
	) => void;
}

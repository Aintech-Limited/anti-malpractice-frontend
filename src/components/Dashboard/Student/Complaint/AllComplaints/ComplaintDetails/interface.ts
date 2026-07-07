import { SetStateAction } from 'react';
import { IComplaint } from '../interface';

export interface IComplaintDetailsProps {
	setSelectedComplaint: (value: SetStateAction<IComplaint | null>) => void;
	selectedComplaint: IComplaint;
}

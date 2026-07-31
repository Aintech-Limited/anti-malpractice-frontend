import { TInstitutionLevelEnum } from '@/src/lib/enums';
import { IMeta } from '../../Dashboard/Department/interface';
import { TSignupStage } from '../interface';

export interface ISignupFormProps {
	setStage: (stage: TSignupStage) => void;
}
export interface ISignupFormValues {
	email: string;
	fullName: string;
	acceptTerms: boolean;
	confirmPassword: string;
	password: string;
}
export interface ISignupFormErrors {
	email: string;
	fullName: string;
	acceptTerms: boolean;
	confirmPassword: string;
}

export interface IDepartment {
	id: string;
	name: string;
}
export interface ISignupInstitution {
	id: string;
	institutionLevel: TInstitutionLevelEnum;
	name: string;
	code: string;
	departments: IDepartment[];
}

export interface IGetInstitutionsResponse {
	message: string;
	success: boolean;
	meta: IMeta;
	data: ISignupInstitution[];
}

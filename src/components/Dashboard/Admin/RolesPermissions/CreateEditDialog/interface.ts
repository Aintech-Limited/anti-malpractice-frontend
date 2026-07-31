import { SetStateAction } from 'react';
import { IGroupedPermissions, IRole } from '../interface';

export interface ICreateEditDialogProps {
	setShowDialog: (value: SetStateAction<boolean>) => void;
	editingRole: IRole | null;
	formName: string;
	setFormName: (value: SetStateAction<string>) => void;
	formErrors: Record<string, string>;
	formDescription: string;
	selectedPermissions: Set<string>;
	groupedPermissions: IGroupedPermissions;
	toggleModule: (module: string) => void;
	toggleAllModulePermissions: (module: string) => void;
	setFormDescription: (value: SetStateAction<string>) => void;
	expandedModules: Set<string>;
	togglePermission: (permissionId: string) => void;
	handleSubmit: () => Promise<void>;
	isSubmitting: boolean;
}

export interface IProfileHeaderProps {
	isEditing: boolean;
	loading: boolean;
	onEdit: () => void;
	onCancel: () => void;
	onSave: () => void;
}

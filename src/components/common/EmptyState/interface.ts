export type EmptyStateIcon =
	| 'book'
	| 'search'
	| 'filter'
	| 'folder'
	| 'alert'
	| 'school'
	| 'users'
	| 'calendar'
	| 'clock'
	| 'file'
	| 'message'
	| 'credit-card'
	| 'building'
	| 'package'
	| 'shopping'
	| 'user-plus'
	| 'mail'
	| 'phone'
	| 'map'
	| 'globe'
	| 'lock'
	| 'unlock'
	| 'check'
	| 'x'
	| 'refresh'
	| 'plus'
	| 'download'
	| 'upload'
	| 'settings'
	| 'help'
	| 'star'
	| 'heart'
	| 'bell'
	| 'eye'
	| 'eye-off'
	| 'trash'
	| 'edit'
	| 'copy'
	| 'share'
	| 'printer'
	| 'save'
	| 'send'
	| 'inbox'
	| 'archive'
	| 'flag'
	| 'more'
	| 'clipboard';

export interface IEmptyStateProps {
	title: string;
	description?: string;
	icon?: EmptyStateIcon;
	action?: {
		label: string;
		onClick?: () => void;
		variant?: 'primary' | 'secondary' | 'outline';
	};
	secondaryAction?: {
		label: string;
		onClick: () => void;
		variant?: 'primary' | 'secondary' | 'outline';
	};
	illustration?: React.ReactNode;
	size?: 'sm' | 'md' | 'lg';
	bordered?: boolean;
	className?: string;
	searchTerm?: string;
	onClearSearch?: () => void;
}

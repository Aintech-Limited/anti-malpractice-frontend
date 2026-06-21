import { ReactNode } from 'react';
import { IAvailableCourseMaterial } from '../interface';

export interface IMaterialListViewProps {
	material: IAvailableCourseMaterial;
	getMaterialIcon: (type: string) => ReactNode;
	onSelectMaterial: (material: IAvailableCourseMaterial | null) => void;
	onViewMaterial: (material: IAvailableCourseMaterial) => void;
	onPurchase: (material: IAvailableCourseMaterial) => void;
	onSetViewMode: (mode: 'list' | 'preview') => void;
	purchasingId: string | null;
}

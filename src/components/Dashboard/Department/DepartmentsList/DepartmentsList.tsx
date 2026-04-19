'use client';
import { DepartmentListItem } from '../DepartmentListItem/DepartmentListItem';
import { IDepartmentsListProps } from './interface';

export const DepartmentsList = ({
	departments,
	onViewDetails,
}: IDepartmentsListProps) => {
	return (
		<div className="space-y-4">
			{departments.map((dept) => (
				<DepartmentListItem
					key={dept.id}
					department={dept}
					onViewDetails={onViewDetails}
				/>
			))}
		</div>
	);
};

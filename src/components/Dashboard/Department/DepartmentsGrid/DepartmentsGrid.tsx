import { DepartmentCard } from '../DepartmentCard/DepartmentCard';
import { IDepartmentsGridProps } from './interface';

export const DepartmentsGrid = ({
	departments,
	onViewDetails,
}: IDepartmentsGridProps) => {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{departments.map((dept) => (
				<DepartmentCard
					key={dept.id}
					department={dept}
					onViewDetails={onViewDetails}
				/>
			))}
		</div>
	);
};

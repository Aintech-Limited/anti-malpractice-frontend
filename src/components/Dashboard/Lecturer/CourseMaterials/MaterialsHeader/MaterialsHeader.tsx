import { Plus } from 'lucide-react';
import { IMaterialsHeaderProps } from './interface';

export const MaterialsHeader = ({
	totalMaterials,
	onCreateMaterial,
	title = 'Course Materials',
	role = 'lecturer',
}: IMaterialsHeaderProps & {
	title?: string;
	role?: 'vendor' | 'lecturer';
}) => {
	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
			<div>
				<h1 className="text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
					{title}
				</h1>
				{role === 'lecturer' ? (
					<p className="text-gray-600 mt-1">
						Manage your teaching materials • {totalMaterials} material
						{totalMaterials !== 1 ? 's' : ''} total
					</p>
				) : (
					<p className="text-gray-600 mt-1">
						Manage your uploaded Books • {totalMaterials} books
						{totalMaterials !== 1 ? 's' : ''} total
					</p>
				)}
			</div>
			<button
				onClick={onCreateMaterial}
				className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
			>
				<Plus className="w-5 h-5" />
				Upload {role === 'lecturer' ? 'Material' : 'Book'}
			</button>
		</div>
	);
};

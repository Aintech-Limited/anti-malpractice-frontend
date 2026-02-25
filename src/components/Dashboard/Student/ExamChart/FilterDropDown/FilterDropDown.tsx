import { ChevronDown } from 'lucide-react';
import { IFilterDropdownProps } from './interface';

const FilterDropdown = ({ label, placeholder }: IFilterDropdownProps) => (
	<div className="w-full md:w-64">
		<label className="block text-sm font-bold text-gray-700 mb-2">
			{label}
		</label>
		<div className="relative cursor-pointer group">
			<div className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-gray-400 flex items-center justify-between group-hover:border-blue-400 transition-colors">
				{placeholder}
				<ChevronDown
					size={18}
					className="text-gray-400 group-hover:text-blue-500"
				/>
			</div>
		</div>
	</div>
);

export default FilterDropdown;

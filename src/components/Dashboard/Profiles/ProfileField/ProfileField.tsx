import { User, Calendar, Phone } from 'lucide-react';
import { IProfileFieldProps } from '../interface';

const iconMap = {
	text: User,
	date: Calendar,
	tel: Phone,
	select: User,
};

export const ProfileField = ({
	label,
	value,
	isEditing,
	type = 'text',
	options,
	onChange,
	icon: CustomIcon,
}: IProfileFieldProps) => {
	const Icon = CustomIcon || iconMap[type] || User;

	if (!isEditing) {
		return (
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-2">
					{label}
				</label>
				<div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
					<Icon className="w-5 h-5 text-gray-400" />
					<span className="text-gray-800">{value || 'Not provided'}</span>
				</div>
			</div>
		);
	}

	return (
		<div>
			<label className="block text-sm font-medium text-gray-700 mb-2">
				{label}
			</label>
			{type === 'select' ? (
				<select
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				>
					<option value="" disabled>
						Select {label.toLowerCase()}
					</option>
					{options?.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			) : (
				<input
					type={type}
					value={value}
					onChange={(e) => onChange?.(e.target.value)}
					placeholder={`Enter ${label.toLowerCase()}`}
					className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
				/>
			)}
		</div>
	);
};

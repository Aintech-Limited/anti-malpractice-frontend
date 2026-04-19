import { IInfoCardProps } from '../interface';
import { formatValue } from '../utils/profileHelpers';

export const InfoCard = ({ icon: Icon, label, value }: IInfoCardProps) => (
	<div className="bg-gray-50 rounded-xl p-4">
		<div className="flex items-center gap-3 mb-2">
			<div className="p-2 bg-indigo-100 rounded-lg">
				<Icon className="w-5 h-5 text-indigo-600" />
			</div>
			<p className="text-sm text-gray-500">{label}</p>
		</div>
		<p className="text-gray-800 font-medium ml-11">{formatValue(value)}</p>
	</div>
);

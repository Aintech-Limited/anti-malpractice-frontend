import { ArrowRight } from 'lucide-react';
import { IStatCardProps } from './interface';

const StatCard = ({
	title,
	count,
	footerText,
	icon: Icon,
	iconBg,
	iconColor,
}: IStatCardProps) => (
	<div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between  hover:translate-x-3">
		<div>
			<div
				className={`w-10 h-10 ${iconBg} rounded-lg flex items-center justify-center mb-4`}
			>
				<Icon className={`w-5 h-5 ${iconColor}`} />
			</div>
			<p className="text-xs font-semibold text-gray-500 mb-1">{title}</p>
			<h3 className="text-2xl font-black text-gray-900">{count}</h3>
		</div>
		<div className="mt-6 flex items-center justify-between group cursor-pointer">
			<span className={`text-[10px] font-bold ${iconColor}`}>{footerText}</span>
			<ArrowRight
				className={`w-3 h-3 ${iconColor} transition-transform group-hover:translate-x-1`}
			/>
		</div>
	</div>
);

export default StatCard;

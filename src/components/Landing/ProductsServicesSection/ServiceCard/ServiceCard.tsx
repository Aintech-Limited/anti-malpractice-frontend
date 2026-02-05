import { ServiceProps } from './interface';

const ServiceCard = ({ icon, title, description, iconBg }: ServiceProps) => (
	<div className="flex flex-col items-start text-left space-y-4">
		<div className={`relative p-3 rounded-xl ${iconBg} bg-opacity-20`}>
			{/* Decorative background square shift */}
			<div
				className={`absolute -top-1 -right-1 w-full h-full rounded-xl ${iconBg} opacity-20 -z-10`}
			/>
			<div className="text-gray-900">{icon}</div>
		</div>
		<h3 className="text-xl font-bold text-gray-900">{title}</h3>
		<p className="text-gray-600 leading-relaxed text-sm md:text-base">
			{description}
		</p>
	</div>
);

export default ServiceCard;

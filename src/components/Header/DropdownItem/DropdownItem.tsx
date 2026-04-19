import Link from 'next/link';
import { ReactNode } from 'react';

function DropdownItem({
	icon,
	label,
	desc,
	href,
}: {
	icon: ReactNode;
	label: string;
	desc?: string;
	href: string;
}) {
	return (
		<Link
			href={href}
			className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 group transition-colors"
		>
			<div className="mt-0.5 text-slate-400 group-hover:text-blue-600">
				{icon}
			</div>
			<div className="flex flex-col">
				<span className="text-sm font-semibold text-slate-900">{label}</span>
				{desc && <span className="text-xs text-slate-500">{desc}</span>}
			</div>
		</Link>
	);
}

export default DropdownItem;

'use client';

import { useAuth } from '@/src/providers/auth/AuthContext';
import { useState } from 'react';
import { ChevronDown, Link } from 'lucide-react';
import { INavGroup } from '../DashboardSidebar/SidebarItem/interface';
import { ProtectedRouteEnum, UserRoleTypeEnum } from '@/src/lib/enums';

const SidebarItem = ({ item }: { item: INavGroup }) => {
	const { user: userData } = useAuth();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const hasChildren = item.children && item.children.length > 0;

	const baseItemStyles = `flex items-center justify-between w-full h-12 px-4 rounded-xl transition-all hover:bg-white/10 group mb-1`;
	const activeStyles = isOpen ? 'bg-white/10' : '';
	const hoverClasses = `hover:bg-white/10 hover:translate-x-1`;

	if (!hasChildren) {
		return (
			<Link
				href={`/${userData?.role === UserRoleTypeEnum.LECTURER ? ProtectedRouteEnum.LECTURERS : ProtectedRouteEnum.STUDENTS}${item.path!}`}
				className={`${baseItemStyles} ${hoverClasses} text-white/90 hover:text-white`}
			>
				<div className="flex items-center gap-4">
					<item.icon className="w-5 h-5 text-blue-100 group-hover:text-white" />
					<span className="text-sm font-semibold text-white">{item.name}</span>
				</div>
			</Link>
		);
	}

	return (
		<div className="w-full">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className={`${baseItemStyles} ${activeStyles}`}
			>
				<div className="flex items-center gap-4">
					<item.icon className="w-5 h-5 text-blue-100 group-hover:text-white" />
					<span className="text-sm font-semibold text-white">{item.name}</span>
				</div>
				<ChevronDown
					className={`w-4 h-4 text-blue-200 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			<div
				className={`overflow-hidden transition-all duration-300 ease-in-out ${
					isOpen ? 'max-h-60 opacity-100 mt-1' : 'max-h-0 opacity-0'
				}`}
			>
				<div className="pl-12 space-y-1 pb-2">
					{item.children.map((child: any) => (
						<a
							key={child.name}
							href={`${userData?.role === UserRoleTypeEnum.LECTURER ? ProtectedRouteEnum.LECTURERS : ProtectedRouteEnum.STUDENTS}${child.path}`}
							className="block py-2 text-xs font-medium text-blue-100 hover:text-white transition-colors border-l border-white/20 pl-4 hover:border-white"
						>
							{child.name}
						</a>
					))}
				</div>
			</div>
		</div>
	);
};

export default SidebarItem;

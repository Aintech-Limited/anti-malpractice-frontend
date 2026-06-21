'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell, BellDot } from 'lucide-react';
import NotificationList from '../NotificationList/NotificationList';
import { useNotificationContext } from '@/src/providers/notifications/NotificationProvider';

export default function NotificationBell({
	className = '',
}: {
	className?: string;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);
	const { unreadCount, isConnected } = useNotificationContext();

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleBellClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={`relative ${className}`} ref={dropdownRef}>
			<button
				onClick={handleBellClick}
				className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
				aria-label="Notifications"
			>
				{unreadCount > 0 ? <BellDot size={20} /> : <Bell size={20} />}
				{unreadCount > 0 && (
					<span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
						{unreadCount > 99 ? '99+' : unreadCount}
					</span>
				)}
				{!isConnected && (
					<span className="absolute -bottom-1 -right-1 w-2 h-2 bg-gray-400 rounded-full"></span>
				)}
				{isConnected && unreadCount === 0 && (
					<span className="absolute top-4 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
				)}
			</button>

			{isOpen && (
				<div className="absolute right-0 mt-2 w-96 z-50">
					<NotificationList onClose={() => setIsOpen(false)} />
				</div>
			)}
		</div>
	);
}

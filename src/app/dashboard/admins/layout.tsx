import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `Admins | FINDU Dashboard`,
	description: 'Admins Dashboard.',
};

export default async function AdminDashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <>{children}</>;
}

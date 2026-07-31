import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `Students | FINDU Dashboard`,
	description: 'Students Dashboard.',
};

export default async function LecturersDashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <>{children}</>;
}

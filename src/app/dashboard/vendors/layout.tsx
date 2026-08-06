import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `Vendors | FINDU Dashboard`,
	description: 'Vendors Dashboard.',
};

export default async function VendorsDashboardLayout({
	children,
}: {
	children: ReactNode;
}) {
	return <>{children}</>;
}

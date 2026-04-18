import { ReactNode } from 'react';
import Layout from '@/src/components/Dashboard/DashboardLayout';
import FooterSection from '@/src/components/FooterSection/FooterSection';

export default function DashboardLayout({ children }: { children: ReactNode }) {
	return (
		<Layout>
			{children} <FooterSection />
		</Layout>
	);
}

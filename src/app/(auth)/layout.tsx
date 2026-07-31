import FooterSection from '@/src/components/FooterSection/FooterSection';
import Header from '@/src/components/Header/Header';
import { ReactNode } from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `Authentication | FINDU`,
	description: 'Findu Authentication.',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<Header />
			{children}
			<FooterSection />
		</>
	);
}

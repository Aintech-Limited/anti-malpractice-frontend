import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header/Header';
import { Providers } from '../providers/Providers';
import FooterSection from '../components/FooterSection/FooterSection';

export const metadata: Metadata = {
	title: 'Aintech MVP',
	description: 'Anti-Malpractice',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<Providers>
					<Header />
					<main>{children}</main>
					<FooterSection />
				</Providers>
			</body>
		</html>
	);
}

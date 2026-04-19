import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../providers/Providers';
import { APP_NAME } from '../lib/data';

export const metadata: Metadata = {
	title: `${APP_NAME.toUpperCase()} MVP`,
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
					<main>{children}</main>
				</Providers>
			</body>
		</html>
	);
}

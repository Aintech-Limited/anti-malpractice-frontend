import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '../providers/Providers';
import { APP_NAME } from '../lib/data';
import { ReactNode } from 'react';

export const metadata: Metadata = {
	title: `${APP_NAME.toUpperCase()} MVP`,
	description: 'A FINDU Educationational Platform for Students and Lecturers.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: ReactNode;
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

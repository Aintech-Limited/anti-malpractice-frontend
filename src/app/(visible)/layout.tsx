import FooterSection from '@/src/components/FooterSection/FooterSection';
import Header from '@/src/components/Header/Header';
import { ReactNode } from 'react';

const VisiblePagesLayout = ({ children }: { children: ReactNode }) => {
	return (
		<div>
			<Header />
			{children}
			<FooterSection />
		</div>
	);
};
export default VisiblePagesLayout;

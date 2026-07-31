import Verify from '@/src/components/Dashboard/Verify/Verify';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `ID Verification | FINDU Dashboard`,
	description: 'Know your Customer.',
};
export default function VerifyPage() {
	return <Verify />;
}

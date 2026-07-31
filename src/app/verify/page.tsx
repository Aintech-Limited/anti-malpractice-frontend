import Verify from '@/src/components/Verify/Verify';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: `Authentication | OTP Verification`,
	description: 'Verify Signup OTP.',
};

export default function VerifyPage() {
	return <Verify />;
}

import Signin from '@/src/components/Signin/Signin';
import { Suspense } from 'react';

export default function SigninPage() {
	return (
		<Suspense fallback={<>Loading Signin</>}>
			<Signin />
		</Suspense>
	);
}

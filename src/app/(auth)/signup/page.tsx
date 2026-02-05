import Signup from '@/src/components/SignUp/SignUp';
import { Suspense } from 'react';

const SignUpPage = () => {
	return (
		<Suspense fallback={<>Loading Signup</>}>
			<Signup />
		</Suspense>
	);
};

export default SignUpPage;

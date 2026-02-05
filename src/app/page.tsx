import { cookies } from 'next/headers';
import OnBoardingLanding from '../components/OnBoardingLanding/OnBoardingLanding';
import Landing from '../components/Landing/Landing';
import { redirect } from 'next/navigation';
import { ProtectedRouteEnum } from '../lib/enums';

export default async function Home() {
	const token = (await cookies()).get(process.env.AUTH_TOKEN_NAME)?.name;
	if (token) redirect(ProtectedRouteEnum.DASHBOARD);

	const visitcount = (await cookies()).get('visit_count')?.value || '0';
	return parseInt(visitcount) <= 1 ? <OnBoardingLanding /> : <Landing />;
}

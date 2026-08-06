import { getUserProfile } from '@/src/lib/serverHelper';
import Profile from '@/src/components/Dashboard/Profiles/Profile';

export default async function ProfilePage() {
	const userData = await getUserProfile();

	return <Profile initialUserData={userData.data} />;
}

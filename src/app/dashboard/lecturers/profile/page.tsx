import { Suspense } from 'react';
import ProfileSkeleton from '@/src/components/Dashboard/Profiles/ProfileSkeleton/ProfileSkeleton';
import { getUserProfile } from '@/src/lib/serverHelper';
import Profile from '@/src/components/Dashboard/Profiles/Profile';

export default async function ProfilePage() {
	const userData = await getUserProfile();

	return (
		<Suspense fallback={<ProfileSkeleton />}>
			<Profile initialUserData={userData.data} />
		</Suspense>
	);
}

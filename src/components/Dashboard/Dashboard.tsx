'use client';

import { useEffect, useState } from 'react';
import FaceIdPopup from '../FaceIdSetup/FaceIdSetup';
import { useAuth } from '@/src/providers/auth/AuthContext';
import { useAppDispatch, useAppSelector } from '@/src/redux/reduxStore';
import { setFaceAuthState } from '@/src/redux/features/faceAuth/faceAuthSlice';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
	const { user } = useAuth();
	const { SkipFaceAuth } = useAppSelector((state) => state.afaceAuth);
	const dispatch = useAppDispatch();
	const router = useRouter();

	const [showFaceId, setShowFaceId] = useState<boolean>(false);

	useEffect(() => {
		if (!user?.faceAuthEnabled && !SkipFaceAuth) {
			setShowFaceId(true);
			return;
		}
	}, [
		SkipFaceAuth,
		router,
		user?.faceAuthEnabled,
		user?.idRecorded,
		user?.profileType,
		user?.role,
	]);

	const handleCloseFaceId = () => {
		setShowFaceId(false);
		dispatch(setFaceAuthState({ SkipFaceAuth: true }));
		return;
	};

	return (
		<>
			<p className="p-20">STILL UNDER CONSRUCTION...</p>
			<FaceIdPopup isOpen={showFaceId} onClose={() => handleCloseFaceId()} />
		</>
	);
};

export default Dashboard;

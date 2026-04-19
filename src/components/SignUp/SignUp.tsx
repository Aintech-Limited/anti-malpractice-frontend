'use client';

import { useCallback, useState } from 'react';
import { TSignupStage } from './interface';
import SignupForm from './SignupForm/SignupForm';
import SignupProfileSelector from './SignupProfileSelector/SignupProfileSelector';

export default function Signup() {
	const [stage, setStage] = useState<TSignupStage>('form');

	const setStageCallback = useCallback((newStage: TSignupStage) => {
		setStage(newStage);
	}, []);

	const rederComponents = () => {
		switch (stage) {
			case 'form':
				return <SignupForm setStage={setStageCallback} />;
			case 'profileSelector':
				return <SignupProfileSelector setStage={setStageCallback} />;
		}
	};

	return rederComponents();
}

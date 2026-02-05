'use client';

import React, { ChangeEvent, useCallback, useState } from 'react';
import { ChevronLeft, Mail } from 'lucide-react';
import { TForgotPasswordPhase } from './interface';
import OTPVerification from './OTPVerification/OTPVerification';
import CreateNewPassword from './CreateNewPassword/CreateNewPassword';
import { isEmail } from 'class-validator';
import { useAppDispatch } from '@/src/redux/reduxStore';
import { setPasswordEmailState } from '@/src/redux/features/forgotPassword/forgotPasswordSlice';
import { toast } from 'react-toastify';
import CustomLoadingIcon from '../common/LoadingIcon/LoadingIcon';

const ForgotPassword = () => {
	const dispatch = useAppDispatch();

	const [disabled, setDisabled] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [email, setEmail] = useState('');
	const [passwordPhase, setPasswordPhase] =
		useState<TForgotPasswordPhase>('COLLECT_EMAIL');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		setLoading(true);

		try {
			const res = await fetch('/api/v1/auth/forgot-password', {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email }),
			});

			if (!res.ok) {
				const data = await res.json();
				toast.error(data.message);
				setLoading(false);
				return;
			}
			console.log('Sending OTP to:', email);
			dispatch(setPasswordEmailState({ passwordEmail: email }));
			setLoading(false);
			setPasswordPhase('VERIFY_OTP');
		} catch (error) {
			console.error(error);
			toast.error('Internal Server Error');
			setLoading(false);
			return;
		}
	};

	const setPhaseCallback = useCallback((phase: TForgotPasswordPhase) => {
		setPasswordPhase(phase);
	}, []);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		let updatedEmail = email;
		setEmail(e.target.value.toLowerCase());
		updatedEmail = e.target.value;

		if (isEmail(updatedEmail)) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const renderPasswordPhase = () => {
		switch (passwordPhase) {
			case 'VERIFY_OTP':
				return <OTPVerification setPhase={setPhaseCallback} />;
			case 'ENTER_NEW_PASSWORD':
				return <CreateNewPassword />;
			case 'COLLECT_EMAIL':
				return (
					<div className="min-h-screen bg-white flex flex-col items-center px-6 py-8 font-sans">
						{/* Top Navigation */}
						<div className="w-full max-w-2xl flex justify-start mb-20">
							<button
								onClick={() => window.history.back()}
								className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-900"
							>
								<ChevronLeft size={24} />
							</button>
						</div>

						{/* Main Content */}
						<div className="w-full max-w-md flex flex-col items-center text-center">
							<h1 className="text-3xl font-bold text-slate-900 mb-4">
								Forgot Password
							</h1>

							<p className="text-slate-400 text-sm md:text-base leading-relaxed mb-12 max-w-70 md:max-w-xs">
								Please enter the email. We will send a code to your mail to
								reset your password
							</p>

							{/* Form */}
							<form onSubmit={handleSubmit} className="w-full space-y-24">
								<div className="text-left">
									<label className="block text-sm font-semibold text-slate-700 mb-3 ml-1">
										Email Address
									</label>
									<div className="relative group">
										<div className="absolute inset-y-0 left-4 flex items-center text-slate-400">
											<Mail size={20} />
										</div>
										<input
											type="email"
											value={email}
											name="email"
											onChange={handleChange}
											placeholder="johnson.dennis@sample.com"
											required
											className="w-full h-14 pl-12 pr-4 bg-white border border-slate-200 rounded-xl text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all outline-none"
										/>
									</div>
								</div>

								{/* Action Button */}
								<button
									type="submit"
									className={`w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 uppercase tracking-wide text-sm ${loading || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}  flex items-center justify-center gap-2`}
									disabled={disabled || loading}
								>
									{loading ? (
										<>
											<CustomLoadingIcon size="md" color="blue" />
											<span>Sending OTP...</span>
										</>
									) : (
										'Send OTP'
									)}
								</button>
							</form>
						</div>
					</div>
				);
		}
	};

	return renderPasswordPhase();
};

export default ForgotPassword;

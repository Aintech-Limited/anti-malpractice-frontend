'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, Delete } from 'lucide-react';
import { IOTPVerificationProps } from './interface';
import VerifyingModal from '../../common/VerifyingModal/VerifyingModal';
import { useAppDispatch, useAppSelector } from '@/src/redux/reduxStore';
import {
	clearPasswordOTPState,
	setPasswordOTPState,
} from '@/src/redux/features/forgotPassword/forgotPasswordSlice';
import { toast } from 'react-toastify';
import CustomLoadingIcon from '../../common/LoadingIcon/LoadingIcon';
import { formatTimeSecToMin } from '@/src/lib/helper';

const OTPVerification = ({ setPhase }: IOTPVerificationProps) => {
	const { passwordEmail, otpExpiry } = useAppSelector(
		(state) => state.aforgotPassword,
	);
	const dispatch = useAppDispatch();

	const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

	const [otp, setOtp] = useState(['', '', '', '', '', '']);
	const [activeSlot, setActiveSlot] = useState<number>(0);
	const [showVerifyModal, setShowVerifyModal] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);
	const [isOtpValid, setIsOtpValid] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [timeLeft, setTimeLeft] = useState<number>(0);

	const initOtpTimer = () => {
		const expiry = Number(process.env.NEXT_PUBLIC_OTP_EXPIRY);

		const expiryTimestamp = Date.now() + expiry * 60 * 1000;

		dispatch(setPasswordOTPState({ otpExpiry: expiryTimestamp }));
	};

	useEffect(() => {
		const initOtpTimer = () => {
			const expirySeconds = Number(process.env.NEXT_PUBLIC_OTP_EXPIRY);

			const expiryTimestamp = Date.now() + expirySeconds * 60 * 1000;

			dispatch(setPasswordOTPState({ otpExpiry: expiryTimestamp }));
		};
		if (!otpExpiry) {
			initOtpTimer();
		}
	}, [dispatch, otpExpiry]);

	useEffect(() => {
		if (!otpExpiry) return;

		const tick = () => {
			const remainingSeconds = Math.max(
				0,
				Math.floor((otpExpiry - Date.now()) / 1000),
			);

			setTimeLeft(remainingSeconds);

			if (remainingSeconds === 0) {
				if (timerRef.current) {
					clearInterval(timerRef.current);
					timerRef.current = null;
				}
				setTimeLeft(0);
			}
		};

		tick();

		timerRef.current = setInterval(tick, 1000);

		return () => {
			if (timerRef.current) {
				clearInterval(timerRef.current);
				timerRef.current = null;
			}
		};
	}, [otpExpiry, dispatch]);

	const handleKeyPress = (num: string) => {
		setErrorMessage('');
		if (activeSlot < 6) {
			const newOtp = [...otp];
			newOtp[activeSlot] = num;
			setOtp(newOtp);
			setActiveSlot((prev) => Math.min(prev + 1, 5));
		}
	};

	const handleBackspace = () => {
		setErrorMessage('');
		const newOtp = [...otp];
		if (otp[activeSlot] !== '') {
			newOtp[activeSlot] = '';
		} else {
			const prevSlot = Math.max(activeSlot - 1, 0);
			newOtp[prevSlot] = '';
			setActiveSlot(prevSlot);
		}
		setOtp(newOtp);
	};

	const handleVerify = async () => {
		const fullOtp = otp.join('');
		console.log(fullOtp, passwordEmail);
		if (fullOtp.length === 6 && passwordEmail) {
			setShowVerifyModal(true);
			setLoading(true);

			try {
				const res = await fetch('/api/v1/auth/verify-password-otp', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email: passwordEmail,
						otp: fullOtp,
					}),
				});

				const data = await res.json();

				if (!res.ok) {
					setErrorMessage(data.message);
					setLoading(false);
					return;
				}

				setIsOtpValid(true);
				setLoading(false);
				dispatch(clearPasswordOTPState());
			} catch (error) {
				console.warn('verify error: ', error);
				setLoading(false);
			}
		}
	};

	const handleOnComplete = () => {
		if (isOtpValid) {
			setPhase('ENTER_NEW_PASSWORD');
			return;
		}
		setShowVerifyModal(false);
		toast.error(errorMessage);
	};

	const handleResendOTP = async () => {
		try {
			const res = await fetch('/api/v1/auth/otp/resend', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					email: passwordEmail,
					type: 'password',
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.message);
				setErrorMessage(data.message);
				return;
			}
			initOtpTimer();
			setOtp(['', '', '', '', '', '']);
			setActiveSlot(0);
			setErrorMessage('');
		} catch (error) {
			console.warn('error resending otp: ', error);
		}
	};

	return (
		<div className="min-h-screen bg-white flex flex-col items-center px-6 py-8 font-sans">
			{/* Navigation */}
			<div className="w-full max-w-2xl flex justify-start mb-16">
				<button
					className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-900"
					onClick={() => setPhase('COLLECT_EMAIL')}
				>
					<ChevronLeft size={24} />
				</button>
			</div>

			<div className="w-full max-w-md flex flex-col items-center">
				{/* Header */}
				<h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 text-center">
					Enter Your 6 digit code
				</h1>
				<p className="text-slate-400 text-sm md:text-base text-center mb-12 max-w-70">
					Please check your email and enter your 6 digit code
				</p>

				{/* OTP Input Display */}
				<div className="flex gap-3 mb-6">
					{otp.map((digit, index) => (
						<div
							key={index}
							onClick={() => setActiveSlot(index)}
							className={`w-16 h-14 flex items-center justify-center rounded-xl text-xl font-bold transition-all border-2 cursor-pointer
                ${
									index === activeSlot
										? 'border-blue-600 bg-slate-100 text-slate-900 shadow-sm'
										: 'border-transparent bg-slate-400 text-white'
								}`}
						>
							{digit}
						</div>
					))}
				</div>

				{/* Resend Link */}
				<p className="text-sm font-medium mb-12">
					Didn&apos;t get the code?{' '}
					<button
						className={`font-bold ${
							timeLeft > 0
								? 'text-slate-400 cursor-not-allowed'
								: 'text-blue-600 hover:underline'
						}`}
						onClick={() => handleResendOTP()}
						disabled={timeLeft > 0}
					>
						{`Resend ${timeLeft > 0 ? formatTimeSecToMin(timeLeft) : ''}`}
					</button>
				</p>
				{errorMessage && <p className="text-red-600">{errorMessage}</p>}

				{/* Verify Button */}
				<button
					className={`w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all mb-12 shadow-lg shadow-blue-100 uppercase ${loading || otp.join('').length < 6 ? 'cursor-not-allowed' : 'cursor-pointer'} flex items-center justify-center gap-2`}
					onClick={handleVerify}
					disabled={otp.join('').length < 6 || loading}
				>
					{loading ? (
						<>
							<CustomLoadingIcon size="md" color="blue" />
							<span>Verifying...</span>
						</>
					) : (
						'Verify'
					)}
				</button>

				{/* Numeric Keypad */}
				<div className="w-full max-w-sm bg-slate-100/80 p-6 rounded-[2.5rem]">
					<div className="grid grid-cols-3 gap-3">
						{[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
							<button
								key={num}
								onClick={() => handleKeyPress(num.toString())}
								className="h-14 bg-slate-400 text-white rounded-lg flex flex-col items-center justify-center hover:bg-slate-500 active:bg-slate-600 transition-colors shadow-sm"
							>
								<span className="text-xl font-bold">{num}</span>
								<span className="text-[10px] opacity-70 uppercase tracking-tighter">
									{num === 2 && 'abc'}
									{num === 3 && 'def'}
									{num === 4 && 'ghi'}
									{num === 5 && 'jkl'}
									{num === 6 && 'mno'}
									{num === 7 && 'pqrs'}
									{num === 8 && 'tuv'}
									{num === 9 && 'wxyz'}
								</span>
							</button>
						))}
						<div /> {/* Spacer */}
						<button
							onClick={() => handleKeyPress('0')}
							className="h-14 bg-slate-400 text-white rounded-lg text-xl font-bold flex items-center justify-center hover:bg-slate-500 active:bg-slate-600 shadow-sm"
						>
							0
						</button>
						<button
							onClick={handleBackspace}
							className="h-14 bg-emerald-100 text-emerald-700 rounded-lg flex items-center justify-center hover:bg-emerald-200 active:bg-emerald-300 shadow-sm"
						>
							<Delete size={24} />
						</button>
					</div>

					{/* Bottom Indicator */}
					<div className="w-24 h-1 bg-slate-900/10 rounded-full mx-auto mt-6" />
				</div>
			</div>

			{showVerifyModal && (
				<VerifyingModal onComplete={handleOnComplete} initialProgress={10} />
			)}
		</div>
	);
};

export default OTPVerification;

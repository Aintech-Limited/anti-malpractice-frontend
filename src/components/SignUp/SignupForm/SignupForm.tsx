'use client';

import { ChangeEvent, FormEvent, memo, useEffect, useState } from 'react';
import Link from 'next/link';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { ISignupFormProps } from './interface';
import { signIn as GoogleSignup, useSession } from 'next-auth/react';
import { isEmail, isStrongPassword, matches } from 'class-validator';
import CustomLoadingIcon from '../../common/LoadingIcon/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/src/redux/reduxStore';
import {
	setSignupState,
	setSignuptokenState,
	setSignupTypeState,
} from '@/src/redux/features/signup/signup';
import GoogleTermsModal from './GooogleTermsModal/GoogleTermsModal';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { APP_NAME } from '@/src/lib/data';

const SignupForm = memo(({ setStage }: ISignupFormProps) => {
	const router = useRouter();
	const { data: googleOauth2Session } = useSession();
	const dispatch = useAppDispatch();
	const { signup } = useAppSelector((state) => state.asignup);

	const [showPassword, setShowPassword] = useState(false);
	const [passwordValid, setPasswordValid] = useState<boolean>(false);
	const [formValues, setFormValues] = useState({
		fullName: signup?.fullName || '',
		email: signup?.email || '',
		password: '',
		confirmPassword: '',
		acceptTerms: false,
	});
	const [formErrors, setFormErrors] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
		acceptTerms: '',
	});
	const [disabled, setDisabled] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [showGoogleTermsModal, setShowGoogleTermsModal] =
		useState<boolean>(false);

	useEffect(() => {
		if (!googleOauth2Session?.idToken) return;
		if (googleOauth2Session?.idToken.length < 1) return;

		const checkEMail = async () => {
			try {
				const res = await fetch('/api/v1/users/exists', {
					method: 'POST',
					body: JSON.stringify({ email: googleOauth2Session.user.email }),
				});

				const data = await res.json();
				console.log('data: ', data);

				if (!res.ok) {
					setLoading(false);
					setDisabled(false);
					toast.error(data.message);
					return;
				}
				if (data.data.email) {
					toast.error('Email already exists');
					setLoading(false);
					setDisabled(true);
					router.push('/signin');
					return;
				}
			} catch (error) {
				toast.error((error as Error).message);
				return;
			}
		};

		checkEMail();

		dispatch(
			setSignuptokenState({
				idToken: googleOauth2Session?.idToken || '',
				acceptTerms: true,
			}),
		);
		dispatch(
			setSignupTypeState({
				signupType: 'google',
			}),
		);
		setStage('profileSelector');
	}, [dispatch, googleOauth2Session, router, setStage]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value, checked } = e.target;

		let email = formValues.email;
		let fullName = formValues.fullName;
		let password = formValues.password;
		let confirmPassword = formValues.confirmPassword;
		let acceptTerms = formValues.acceptTerms;

		if (name === 'acceptTerms') {
			acceptTerms = checked;
			setFormValues((prev) => ({ ...prev, acceptTerms: checked }));
			if (!checked) {
				setFormErrors((prev) => ({
					...prev,
					acceptTerms: 'must agree to terms',
				}));
			} else {
				setFormErrors((prev) => ({ ...prev, acceptTerms: '' }));
			}
		}

		if (name === 'email') {
			email = value.trim();
			const haseError = isEmail(email);
			if (!haseError && email) {
				setFormErrors((prev) => ({ ...prev, email: 'email must be valid' }));
			} else {
				setFormErrors((prev) => ({ ...prev, email: '' }));
			}
			setFormValues((prev) => ({ ...prev, email }));
		}

		if (name === 'fullName') {
			fullName = value;
			if (!matches(fullName, /^[a-zA-Z]{2,} [a-zA-Z]{2,}$/)) {
				setFormErrors((prev) => ({
					...prev,
					fullName: 'must enter: firstname lastname only',
				}));
			} else {
				setFormErrors((prev) => ({ ...prev, fullName: '' }));
			}
			setFormValues((prev) => ({ ...prev, fullName }));
		}

		if (name === 'password') {
			password = value;

			if (password && !isStrongPassword(password)) {
				setPasswordValid(false);
			} else {
				setFormErrors((prev) => ({ ...prev, password: '' }));
				setPasswordValid(true);
			}
			setFormValues((prev) => ({ ...prev, password }));
		}

		if (name === 'confirmPassword') {
			confirmPassword = value;
			if (confirmPassword && formValues.password !== confirmPassword) {
				setFormErrors((prev) => ({
					...prev,
					confirmPassword: 'Passwords do not match',
				}));
			} else {
				setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
			}
			setFormValues((prev) => ({ ...prev, confirmPassword }));
		}

		if (
			!isEmail(email) ||
			!isStrongPassword(password) ||
			password !== confirmPassword ||
			!acceptTerms ||
			!matches(fullName, /^[a-zA-Z]{2,} [a-zA-Z]{2,}$/)
		) {
			return;
		}

		setDisabled(false);
	};

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault();
		setLoading(true);

		try {
			const res = await fetch('/api/v1/users/exists', {
				method: 'POST',
				body: JSON.stringify({ email: formValues.email }),
			});

			const data = await res.json();

			if (!res.ok) {
				setLoading(false);
				setDisabled(false);
				toast.error(data.message);
				return;
			}
			if (data.data.email) {
				toast.error('Email already exists');
				setFormErrors((prev) => ({ ...prev, email: 'email already exists' }));
				setLoading(false);
				setDisabled(true);
				return;
			}
		} catch (error) {
			toast.error((error as Error).message);
			return;
		}

		dispatch(setSignupState(formValues));
		dispatch(
			setSignupTypeState({
				signupType: 'email',
			}),
		);
		setStage('profileSelector');
	};

	const handleAcceptGoogleSignup = () => {
		dispatch(
			setSignupTypeState({
				signupType: 'google',
			}),
		);
		(() =>
			GoogleSignup('google', {
				callbackUrl: '/signup',
			}))();
	};

	const handleCancelGoogleSignup = () => {
		setShowGoogleTermsModal(false);
	};

	return (
		<div className="max-w-120 mx-auto pt-12 pb-20 px-6">
			{/* Progress Bars */}
			<div className="flex gap-2 mb-10">
				<div className="h-1.5 flex-1 bg-slate-300 rounded-full"></div>
				<div className="h-1.5 flex-1 bg-slate-200 rounded-full"></div>
				{/* <div className="h-1.5 flex-1 bg-slate-200 rounded-full"></div> */}
			</div>

			<h1 className="text-2xl font-bold text-slate-900 text-center mb-10">
				Create your {APP_NAME} Account
			</h1>

			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Full Name */}
				<div>
					<label className="block text-sm font-semibold text-slate-700 mb-2">
						Full Name
					</label>
					<div className="relative">
						<User
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							size={18}
						/>
						<input
							type="text"
							placeholder="Blessing James"
							className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black"
							onChange={handleChange}
							required
							name="fullName"
							value={formValues.fullName}
							minLength={2}
							maxLength={255}
						/>
					</div>
					<div className="text-red-500">{formErrors.fullName}</div>
				</div>

				{/* Email */}
				<div>
					<label className="block text-sm font-semibold text-slate-700 mb-2">
						Email Address
					</label>
					<div className="relative">
						<Mail
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							size={18}
						/>
						<input
							type="email"
							placeholder="blessingjam@gmail.com"
							className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-black"
							onChange={handleChange}
							required
							name="email"
							value={formValues.email}
							minLength={3}
							maxLength={100}
						/>
					</div>
					<div className="text-red-500">{formErrors.email}</div>
				</div>

				{/* Password */}
				<div>
					<label className="block text-sm font-semibold text-slate-700 mb-2">
						Password
					</label>
					<div className="relative">
						<Lock
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							size={18}
						/>
						<input
							type={showPassword ? 'text' : 'password'}
							placeholder="************"
							className="w-full pl-10 text-black pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
							onChange={handleChange}
							required
							name="password"
							value={formValues.password}
							minLength={8}
							maxLength={40}
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
						>
							{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
						</button>
					</div>
				</div>

				{/* Validation Checks */}
				{!passwordValid && (
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-green-600 font-medium">
							<CheckCircle2 size={18} fill="#dcfce7" /> Must contain 8
							characters
						</div>
						<div className="flex items-center gap-2 text-sm text-green-600 font-medium">
							<CheckCircle2 size={18} fill="#dcfce7" /> Must contain a number
						</div>
						<div className="flex items-center gap-2 text-sm text-green-600 font-medium">
							<CheckCircle2 size={18} fill="#dcfce7" /> Must contain upper-case
							letter
						</div>
						<div className="flex items-center gap-2 text-sm text-green-600 font-medium">
							<CheckCircle2 size={18} fill="#dcfce7" /> Must contain lower-case
							letter
						</div>
						<div className="flex items-center gap-2 text-sm text-green-600 font-medium">
							<CheckCircle2 size={18} fill="#dcfce7" /> Must contain special
							character
						</div>
					</div>
				)}

				{/* Confirm Password */}
				<div>
					<label className="block text-sm font-semibold text-slate-700 mb-2">
						Confirmed password
					</label>
					<div className="relative">
						<Lock
							className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
							size={18}
						/>
						<input
							type="password"
							placeholder="************"
							className="w-full pl-10 pr-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
							required
							onChange={handleChange}
							name="confirmPassword"
							value={formValues.confirmPassword}
						/>
					</div>
					<div className="text-red-500">{formErrors.confirmPassword}</div>
				</div>

				{/* Terms */}
				<div className="flex items-start gap-3">
					<input
						type="checkbox"
						className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
						required
						onChange={handleChange}
						name="acceptTerms"
					/>
					<p className="text-sm text-slate-600">
						Signing up for {APP_NAME} account means you agree to our{' '}
						<Link
							href="/privacy"
							className="text-slate-900 font-bold underline"
						>
							privacy policy
						</Link>{' '}
						and{' '}
						<Link href="/terms" className="text-slate-900 font-bold underline">
							terms & conditions.
						</Link>
					</p>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className={`w-full py-4 bg-[#456284] text-white font-bold rounded-xl hover:bg-[#364d69] transition-colors shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 ${
						loading || disabled ? 'opacity-70 cursor-not-allowed' : ''
					}`}
					disabled={disabled || loading}
				>
					{loading ? (
						<>
							<CustomLoadingIcon size="md" color="blue" />
							<span>Creating Account...</span>
						</>
					) : (
						'Create Account'
					)}
				</button>
			</form>

			{/* OR Divider */}
			<div className="relative my-8 text-center">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-t border-slate-200"></div>
				</div>
				<span className="relative px-4 bg-white text-sm text-slate-400 font-medium">
					OR
				</span>
			</div>

			{/* Google Sign In */}
			<button
				className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-bold text-slate-700"
				onClick={() => setShowGoogleTermsModal(true)}
			>
				<Image
					src={
						'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
					}
					alt="Google"
					width={30}
					height={40}
				/>
				Sign up with Google
			</button>

			<p className="text-center mt-8 text-slate-500 text-sm">
				Already have an account?{' '}
				<Link
					href="/signin"
					className="text-blue-600 font-bold hover:underline"
				>
					Log in
				</Link>
			</p>

			{showGoogleTermsModal && (
				<GoogleTermsModal
					isOpen={showGoogleTermsModal}
					onAccept={handleAcceptGoogleSignup}
					onClose={handleCancelGoogleSignup}
				/>
			)}
		</div>
	);
});

SignupForm.displayName = 'SignupForm';

export default SignupForm;

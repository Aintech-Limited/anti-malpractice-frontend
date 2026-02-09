'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Mail, Lock, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
	signIn as GoogleSinIn,
	signOut as GoogleSignout,
	useSession,
} from 'next-auth/react';
import { useAuth } from '@/src/providers/auth/AuthContext';
import { toast } from 'react-toastify';
import CustomLoadingIcon from '../common/LoadingIcon/LoadingIcon';
import { isEmail, isStrongPassword } from 'class-validator';
import { aintechLogo } from '@/public/assetLinks';
import { useAppDispatch } from '@/src/redux/reduxStore';
import { setOTPEmailState } from '@/src/redux/features/otpExpiry/otpExpirySlice';

const Signin = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const { data: googleOauth2Session } = useSession();
	const { signIn: AuthProviderSignIn } = useAuth();

	const [email, setEmail] = useState<string>('');
	const [password, setPassword] = useState<string>('');

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [disabled, setDisabled] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!googleOauth2Session) return;
		if (!googleOauth2Session?.idToken || googleOauth2Session?.idToken === '')
			return;

		const signinWithGoogle = async () => {
			try {
				const res = await fetch('/api/v1/auth/signingoogle', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						idToken: googleOauth2Session.idToken,
					}),
					credentials: 'include',
				});
				const data = await res.json();
				if (!res.ok) {
					console.warn(data.message);

					if (res.status === 401) {
						GoogleSignout();
						toast.error('Unauthorized. Try signin again.');
						return;
					}
				}

				AuthProviderSignIn(data.data);

				router.push('/dashboard');
			} catch (e) {
				console.error('error signing google in user: ', e);
			}
		};

		if (googleOauth2Session.idToken.length > 0) signinWithGoogle();
	}, [AuthProviderSignIn, googleOauth2Session, router]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let updatedEmail = email;
		let updatedPassword = password;

		if (name === 'email') {
			updatedEmail = value.trim();
			setEmail(value.trim());
		}

		if (name === 'password') {
			updatedPassword = value.trim();
			setPassword(value.trim());
		}

		if (
			updatedEmail &&
			isEmail(updatedEmail) &&
			updatedPassword &&
			isStrongPassword(updatedPassword)
		) {
			setDisabled(false);
		}
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setLoading(true);

		const signin = async () => {
			try {
				const res = await fetch('/api/v1/auth/signin', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						email,
						password,
					}),
					credentials: 'include',
				});
				const data = await res.json();
				if (!res.ok) {
					setLoading(false);
					setDisabled(false);
					if (data?.message?.includes('Account does not have a set password')) {
						toast.error('Account does not have a set password. Please signin with Google');
						setLoading(false);
						return;
					}
					if (res.status === 409) {
						dispatch(setOTPEmailState({ email }));
						toast.success('Check your email for an otp to verify your account');
						router.push('/verify');
						return;
					}
					toast.error(data.message);
					return;
				}
				toast.success(data.message);

				AuthProviderSignIn(data.data);

				router.push('/dashboard');

				return;
			} catch (e) {
				console.error('error signing in user: ', e);
			}
		};

		await signin();
	};

	return (
		<>
			<div className="min-h-screen bg-white flex items-center justify-center p-4 md:p-8">
				<div className="w-full max-w-md flex flex-col items-center">
					<div className="mb-8">
						<div className="w-16 h-16 flex items-center justify-center">
							<Image
								src={aintechLogo}
								alt="AINTECH LOGO"
								width={60}
								height={40}
							/>
						</div>
					</div>

					{/* Heading */}
					<div className="text-center mb-8">
						<h1 className="text-2xl font-bold text-slate-900 mb-2">
							Login to your Aintech Account
						</h1>
						<p className="text-slate-600 text-sm">
							Welcome back! Please enter your details.
						</p>
					</div>

					<form className="w-full space-y-5" onSubmit={handleSubmit}>
						{/* Email Field */}
						<div>
							<label className="block text-sm font-medium text-slate-700 mb-1.5">
								Email
							</label>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Mail className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type="email"
									className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-600 placeholder:text-slate-400"
									placeholder="Johnson.dennis@sample.com"
									value={email}
									onChange={handleChange}
									maxLength={100}
									name="email"
								/>
							</div>
						</div>

						{/* Password Field */}
						<div>
							<div className="flex justify-between items-center mb-1.5">
								<label className="block text-sm font-medium text-slate-700">
									Password
								</label>
							</div>
							<div className="relative">
								<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
									<Lock className="h-5 w-5 text-slate-400" />
								</div>
								<input
									type={showPassword ? 'text' : 'password'}
									className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-600"
									placeholder="***********"
									value={password}
									onChange={handleChange}
									maxLength={40}
									name="password"
								/>
								<button
									type="button"
									onClick={() => setShowPassword(!showPassword)}
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
								>
									<EyeOff className="h-5 w-5" />
								</button>
							</div>
							<div className="text-right mt-2">
								<button
									type="button"
									className="text-xs font-semibold text-blue-600 hover:underline"
									onClick={() => router.push('/forgot-password')}
								>
									Forgot Password
								</button>
							</div>
						</div>

						{/* Sign In Button */}
						<button
							type="submit"
							className={`w-full py-4 bg-[#456284] text-white font-bold rounded-xl hover:bg-[#364d69] transition-colors shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2 ${
								loading || disabled ? 'opacity-70 cursor-not-allowed' : ''
							}`}
							disabled={disabled}
						>
							{loading ? (
								<>
									<CustomLoadingIcon size="md" color="blue" />
									<span>Signin in...</span>
								</>
							) : (
								'Sign in'
							)}
						</button>

						{/* Divider */}
						<div className="relative flex items-center py-2">
							<div className="grow border-t border-slate-200"></div>
							<span className="shrink mx-4 text-slate-400 text-xs font-medium">
								OR
							</span>
							<div className="grow border-t border-slate-200"></div>
						</div>

						{/* Google Sign In */}
						<button
							type="button"
							className="w-full py-3 flex items-center justify-center gap-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
							onClick={() =>
								GoogleSinIn('google', {
									callbackUrl: '/signin',
								})
							}
						>
							<Image
								src={
									'https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
								}
								alt="Google"
								width={30}
								height={20}
							/>

							<span className="text-slate-700 font-medium">
								Sign in with Google
							</span>
						</button>
					</form>

					{/* Footer Link */}
					<p className="mt-8 text-sm text-slate-500">
						Don&apos;t have an account?{' '}
						<button className="text-blue-600 font-bold hover:underline">
							<a href="/signup">Sign up</a>
						</button>
					</p>
				</div>
			</div>
		</>
	);
};

export default Signin;

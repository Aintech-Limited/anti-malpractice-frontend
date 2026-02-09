'use client';

import { ChangeEvent, useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import PasswordVerifyingModal from '../../common/VerifyingModal/VerifyingModal';
import ForgotPasswordSuccess from './ForgotPasswordSuccess/ForgotPasswordSuccess';
import { isStrongPassword } from 'class-validator';
import CustomLoadingIcon from '../../common/LoadingIcon/LoadingIcon';
import { useAppDispatch, useAppSelector } from '@/src/redux/reduxStore';
import { toast } from 'react-toastify';
import { clearPasswordEmailState } from '@/src/redux/features/forgotPassword/forgotPasswordSlice';

export interface IPasswordUpdateForm {
	password: string;
	confirmPassword: string;
}

const CreateNewPassword = () => {
	const { passwordEmail } = useAppSelector((state) => state.aforgotPassword);
	const dispatch = useAppDispatch();

	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [disabled, setDisabled] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [passwordValid, setPasswordValid] = useState<boolean>(false);
	const [passwordUpdateSuccess, setPasswordUpdateSuccess] =
		useState<boolean>(false);
	const [modalPhase, setModalPhase] = useState<'loading' | 'success' | ''>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [passwordValues, setPasswordValues] = useState<IPasswordUpdateForm>({
		password: '',
		confirmPassword: '',
	});
	const [confirmPasswordErrors, setConfirmPassword] = useState<string>('');

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { value, name } = e.target;

		let updatedPassword = passwordValues.password;
		let updatedConfirmPassword = passwordValues.confirmPassword;

		if (name === 'password') {
			updatedPassword = value;

			if (updatedPassword && !isStrongPassword(updatedPassword)) {
				setPasswordValid(false);
			} else {
				setPasswordValid(true);
			}
			if (updatedPassword.length <= 40)
				setPasswordValues((prev) => ({ ...prev, password: updatedPassword }));
		}

		if (name === 'confirmPassword') {
			updatedConfirmPassword = value;
			if (
				updatedConfirmPassword &&
				passwordValues.password !== updatedConfirmPassword
			) {
				setConfirmPassword('Passwords do not match');
			} else {
				setConfirmPassword('');
			}
			setPasswordValues((prev) => ({
				...prev,
				confirmPassword: updatedConfirmPassword,
			}));
		}

		if (
			updatedConfirmPassword === updatedPassword &&
			isStrongPassword(updatedPassword)
		) {
			setDisabled(false);
		} else {
			setDisabled(true);
		}
	};

	const handleOnPasswordUpdate = async () => {
		if (!passwordEmail) return;

		setModalPhase('loading');
		setLoading(true);

		try {
			const res = await fetch('/api/v1/auth/reset-password', {
				method: 'POST',
				body: JSON.stringify({
					email: passwordEmail,
					password: passwordValues.password,
				}),
			});

			const data = await res.json();

			if (!res.ok) {
				if (
					res.status === 400 &&
					data?.message?.includes('reuse old password')
				) {
					setErrorMessage('Cannot reuse old password');
					setLoading(false);
					setDisabled(false);
					return;
				}
				setErrorMessage(data.message);
				setLoading(false);
				setDisabled(false);
				return;
			}
			setPasswordUpdateSuccess(true);
			dispatch(clearPasswordEmailState());
		} catch (error) {
			setErrorMessage((error as Error).message);
		}
	};

	const handleOnComplete = () => {
		if (passwordUpdateSuccess) {
			setModalPhase('success');
			return;
		}
		setModalPhase('');
		toast.error(errorMessage);
		setLoading(false);
		setDisabled(false);
	};

	return (
		<div className="min-h-screen bg-white flex flex-col items-center px-6 py-12 font-sans">
			<div className="w-full max-w-md flex flex-col items-center">
				{/* Header Section */}
				<h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 text-center">
					Create New password
				</h1>
				<p className="text-slate-400 text-sm md:text-base text-center mb-16 max-w-70">
					Please enter your passwords to complete password reset
				</p>

				{/* Form Fields */}
				<div className="w-full space-y-8">
					{/* New Password Input */}
					<div className="space-y-2">
						<label className="text-sm font-semibold text-slate-700 ml-1">
							New Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
								<Lock size={20} />
							</div>
							<input
								type={showPassword ? 'text' : 'password'}
								placeholder="New Password"
								onChange={handleChange}
								value={passwordValues.password}
								minLength={8}
								maxLength={40}
								name="password"
								className="w-full h-14 pl-12 pr-12 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-slate-300 text-slate-600"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-slate-500"
							>
								{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
								<CheckCircle2 size={18} fill="#dcfce7" /> Must contain
								upper-case letter
							</div>
							<div className="flex items-center gap-2 text-sm text-green-600 font-medium">
								<CheckCircle2 size={18} fill="#dcfce7" /> Must contain
								lower-case letter
							</div>
							<div className="flex items-center gap-2 text-sm text-green-600 font-medium">
								<CheckCircle2 size={18} fill="#dcfce7" /> Must contain special
								character
							</div>
						</div>
					)}

					{/* Confirm Password Input */}
					<div className="space-y-2">
						<label className="text-sm font-semibold text-slate-700 ml-1">
							Confirm Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-4 flex items-center text-slate-300">
								<Lock size={20} />
							</div>
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								placeholder="Confirm Password"
								onChange={handleChange}
								value={passwordValues.confirmPassword}
								name="confirmPassword"
								minLength={8}
								maxLength={40}
								className="w-full h-14 pl-12 pr-12 border border-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:border-blue-600 transition-all placeholder:text-slate-300 text-slate-600"
							/>
							<button
								type="button"
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className="absolute inset-y-0 right-4 flex items-center text-slate-300 hover:text-slate-500"
							>
								{showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
							</button>
						</div>
						{confirmPasswordErrors && (
							<div className="text-red-600">{confirmPasswordErrors}</div>
						)}
					</div>
				</div>

				{/* Action Button */}
				<div className="w-full mt-24 flex items-center justify-center gap-2 flex-col">
					<button
						disabled={disabled}
						onClick={handleOnPasswordUpdate}
						className={`w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-100 uppercase tracking-wide text-sm ${
							disabled || loading
								? 'opacity-70 cursor-not-allowed'
								: 'cursor-pointer'
						}  flex items-center justify-center gap-2`}
					>
						{loading ? (
							<>
								<CustomLoadingIcon size="md" color="blue" />
								<span>Updating Password...</span>
							</>
						) : (
							'Update Password'
						)}
					</button>

					<button
						className="pt-10 cursor-pointer font-bold"
						onClick={() => window.history.back()}
					>
						Cancel
					</button>
				</div>
			</div>
			{modalPhase === 'loading' && (
				<PasswordVerifyingModal
					onComplete={handleOnComplete}
					initialProgress={10}
					message="Updating password"
				/>
			)}
			{modalPhase === 'success' && <ForgotPasswordSuccess />}
		</div>
	);
};

export default CreateNewPassword;

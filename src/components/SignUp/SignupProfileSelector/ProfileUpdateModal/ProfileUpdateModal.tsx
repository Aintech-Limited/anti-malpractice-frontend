import { X, AlertCircle } from 'lucide-react';
import { IProfileUpdateModalProps } from './interface';
import { ChangeEvent, FormEvent, useState } from 'react';
import { SexTypeEnum, SexTypeEnumValue } from '@/src/lib/enums';
import CustomLoadingIcon from '@/src/components/common/LoadingIcon/LoadingIcon';
import { isPhoneNumber } from 'class-validator';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/redux/reduxStore';
import {
	clearSignupState,
	clearSignupTokenState,
	clearSignupTypeState,
} from '@/src/redux/features/signup/signup';
import { setOTPEmailState } from '@/src/redux/features/otpExpiry/otpExpirySlice';
import { useSession, signOut as GoogleSinOut } from 'next-auth/react';

const ProfileUpdateModal = ({ isOpen, onClose }: IProfileUpdateModalProps) => {
	const router = useRouter();
	const { data: googleOauth2Session } = useSession();
	const { signup, signupToken, signupType } = useAppSelector(
		(state) => state.asignup,
	);
	const dispatch = useAppDispatch();

	const [showErrors, setShowError] = useState<boolean>(false);
	const [showGenderError, setShowGenderError] = useState<boolean>(false);
	const [showDOBError, setShowDOBError] = useState<boolean>(false);
	const [showPhoneError, setShowPhoneError] = useState<boolean>(false);

	const [sex, setSex] = useState<SexTypeEnumValue | null>(null);
	const [phoneContact, setPhoneContact] = useState<string>('');
	const [dob, setDOB] = useState<string>('');
	const [age, setAge] = useState<number>(18);

	const [disabled, setDisabled] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);

	const handleAnimationEnd = () => {
		if (!isOpen) onClose();
	};

	if (!isOpen) return null;

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		let updatedPhone = phoneContact;
		let updatedDOB = dob;

		if (name === 'DOB') {
			setDOB(value);
			updatedDOB = value;

			const birthDate = new Date(value);
			const today = new Date();
			let currentAge = today.getFullYear() - birthDate.getFullYear();
			const monthDiff = today.getMonth() - birthDate.getMonth();

			if (
				monthDiff < 0 ||
				(monthDiff === 0 && today.getDate() < birthDate.getDate())
			) {
				currentAge--;
			}
			setAge(currentAge);
		}
		if (name === 'phoneContact') {
			updatedPhone = value;
			setPhoneContact(value);
		}

		if (sex && updatedPhone && updatedDOB) setDisabled(false);
	};

	const handleSaveProfile = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setShowError(false);
		setShowGenderError(false);
		setShowDOBError(false);
		setShowPhoneError(false);

		if (age < 15) {
			toast.error('You must be at least 15 years old to register.');
			return;
		}

		let hasError = false;

		if (!sex) {
			setShowGenderError(true);
			hasError = true;
		}
		if (!dob) {
			setShowDOBError(true);
			hasError = true;
		}
		if (!isPhoneNumber(phoneContact)) {
			setShowPhoneError(true);
			hasError = true;
		}

		if (hasError) {
			setShowError(true);
			return;
		}

		setLoading(true);
		if (!signup && !signupToken) {
			setLoading(false);
			router.push('/signup');
			return;
		}

		const [year, month, day] = dob.split('-');
		const formattedDate = `${month}/${day}/${year}`;

		if (signupType === 'google') {
			const signupWithGoogle = async () => {
				try {
					const res = await fetch('/api/v1/auth/signupgoogle', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({
							idToken: signupToken?.idToken,
							acceptTerms: signupToken?.acceptTerms,
							dob: formattedDate,
							...(sex !== SexTypeEnum.OTHER && { sex }),
							profileType: signupToken?.profileType,
							phoneContact,
							institutionId: signupToken?.institutionId,
							departmentId: signupToken?.departmentId,
							country: signupToken?.country,
							state: signupToken?.state,
						}),
						credentials: 'include',
					});
					const data = await res.json();
					if (!res.ok) {
						setLoading(false);
						setDisabled(false);
						console.log(data?.message);
						if (
							(data?.message as string)?.includes('Google ID Token has expired')
						) {
							toast.error('Waited too long. Please try again.');
							GoogleSinOut({ redirect: false });
							router.push('/signup');
							return;
						}
						toast.error(data?.message);
						console.log(data);
						return;
					}
					dispatch(clearSignupTokenState());

					toast.success('Profile Created successfully');
					dispatch(
						setOTPEmailState({ email: googleOauth2Session!.user!.email! }),
					);
					router.push('/signin');

					return;
				} catch (e) {
					console.error('error signing up google user: ', (e as Error).message);
				}
			};

			await signupWithGoogle();
		} else if (signupType === 'email') {
			const signupWithPassword = async () => {
				try {
					const res = await fetch('/api/v1/auth/signup', {
						method: 'POST',
						headers: { 'Content-type': 'application/json' },
						body: JSON.stringify({
							email: signup?.email,
							fullName: signup?.fullName,
							password: signup?.password,
							acceptTerms: signup?.acceptTerms,
							dob: formattedDate,
							...(sex !== SexTypeEnum.OTHER && { sex }),
							profileType: signup?.profileType,
							phoneContact,
							institutionId: signup?.institutionId,
							departmentId: signup?.departmentId,
							country: signup?.country,
							state: signup?.state,
						}),
					});
					const data = await res.json();
					if (!res.ok) {
						toast.error(data?.message);
						console.log(data);
						return;
					}
					dispatch(clearSignupState());
					dispatch(clearSignupTokenState());
					dispatch(clearSignupTypeState());

					dispatch(setOTPEmailState({ email: signup!.email }));

					toast.success('Profile Created successfully');
					router.push('/verify');
				} catch (error) {
					toast.error((error as Error).message);
					console.error(error);
				} finally {
					setLoading(false);
				}
			};

			await signupWithPassword();
		}
	};

	return (
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ease-out ${
				isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
			onTransitionEnd={handleAnimationEnd}
		>
			<div
				className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
				// onClick={onClose}
			/>

			<div
				className={`bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative border border-slate-100 transform transition-all duration-300 ease-out ${
					isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
				}`}
			>
				<button
					onClick={onClose}
					className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-10"
				>
					<X size={24} />
				</button>

				<div className="p-6 md:p-12 max-h-[90vh] overflow-y-auto">
					<header className="text-center mb-8 pt-4">
						<h2 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">
							We&apos;d like to get a little more information about you
						</h2>
					</header>

					{showErrors && (
						<div className="bg-orange-50 rounded-xl p-5 mb-8 border border-orange-100">
							<ul className="space-y-4">
								{showGenderError && (
									<li className="flex items-start gap-3 text-orange-900/80 text-sm md:text-base">
										<AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-orange-500" />
										<span>Please select a gender</span>
									</li>
								)}
								{showDOBError && (
									<li className="flex items-start gap-3 text-orange-900/80 text-sm md:text-base">
										<AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-orange-500" />
										<span>Please add a DOB</span>
									</li>
								)}
								{showPhoneError && (
									<li className="flex items-start gap-3 text-orange-900/80 text-sm md:text-base">
										<AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-orange-500" />
										<span>
											You need to update your contact number for internal comms
											and reminders.
										</span>
									</li>
								)}
							</ul>
						</div>
					)}

					{/* Form */}
					<form className="space-y-6" onSubmit={handleSaveProfile}>
						<div className="group">
							<label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-blue-600">
								Gender
							</label>
							<div className="relative">
								<select
									className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg appearance-none text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
									onChange={(e) => setSex(e.target.value as SexTypeEnumValue)}
									value={sex || ''}
								>
									<option value="" disabled>
										Select Gender
									</option>
									<option value={SexTypeEnum.MALE}>{SexTypeEnum.MALE}</option>
									<option value={SexTypeEnum.FEMALE}>
										{SexTypeEnum.FEMALE}
									</option>
									<option value={SexTypeEnum.OTHER}>{SexTypeEnum.OTHER}</option>
								</select>
								<div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</div>
							</div>
						</div>

						<div className="group">
							<label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-blue-600">
								Date of Birth
							</label>
							<div className="relative">
								<input
									type="date"
									required
									placeholder="dd/mm/yyyy"
									className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									inputMode="numeric"
									name="DOB"
									onChange={handleChange}
									value={dob}
									maxLength={14}
								/>
							</div>
							{age < 15 && dob.length === 14 && (
								<li className="flex items-start gap-3 text-red-900/80 text-sm">
									<AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
									<span>You must be at least 15 years old.</span>
								</li>
							)}
						</div>

						<div className="group">
							<label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 transition-colors group-focus-within:text-blue-600">
								Contact number for internal comms
							</label>
							<input
								type="tel"
								placeholder="2348012328435"
								className="w-full h-12 px-4 bg-white border border-slate-200 rounded-lg text-slate-600 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
								onChange={handleChange}
								name="phoneContact"
								value={phoneContact}
							/>
						</div>

						<div className="pt-4">
							<button
								type="submit"
								className={`w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 ${
									loading || disabled ? 'opacity-70 cursor-not-allowed' : ''
								}`}
								disabled={disabled || loading}
							>
								{loading ? (
									<>
										<CustomLoadingIcon size="md" color="blue" />
										<span>Saving Profile...</span>
									</>
								) : (
									'Save Profile'
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default ProfileUpdateModal;

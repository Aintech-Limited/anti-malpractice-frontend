'use client';

import { useState } from 'react';
import { X, ShieldCheck, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { IGoogleTermsModalProps } from './interface';
import Link from 'next/link';

const GoogleTermsModal = ({
	isOpen = true,
	onClose,
	onAccept,
}: IGoogleTermsModalProps) => {
	const [shouldRender, setShouldRender] = useState(isOpen);

	const handleAnimationEnd = () => {
		if (!isOpen) setShouldRender(false);
	};

	if (!shouldRender) return null;

	return (
		<div
			className={`fixed inset-0 z-100 flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out ${
				isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
			}`}
			onTransitionEnd={handleAnimationEnd}
		>
			<div
				className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
				onClick={onClose}
			/>

			<div
				className={`relative bg-white w-full max-w-md rounded-[2.5rem] p-8 md:p-10 shadow-2xl transform transition-all duration-300 ease-out ${
					isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-8'
				}`}
			>
				<button
					onClick={onClose}
					className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
				>
					<X size={24} />
				</button>

				<div className="flex flex-col items-center text-center">
					<div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 border border-blue-100">
						<ShieldCheck
							size={40}
							className="text-blue-600"
							strokeWidth={1.5}
						/>
					</div>

					<h2 className="text-2xl font-bold text-slate-900 mb-4 px-2">
						Sign up with Google
					</h2>

					<p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
						To continue with Google, please confirm that you agree to our
						<span className="text-blue-600 font-semibold mx-1 cursor-pointer hover:underline inline-flex items-center gap-0.5">
							<Link href="/terms">
								Terms of Service <ExternalLink size={12} />
							</Link>
						</span>
						and
						<span className="text-blue-600 font-semibold mx-1 cursor-pointer hover:underline inline-flex items-center gap-0.5">
							<Link href="/policy">
								Privacy Policy <ExternalLink size={12} />
							</Link>
						</span>
					</p>

					<div className="w-full space-y-3">
						<button
							onClick={onAccept}
							className="w-full py-4 bg-[#1A73E8] text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-100 active:scale-[0.98] cursor-pointer"
						>
							<Image
								src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
								alt="Google"
								width={50}
								height={60}
							/>
							Accept and Continue
						</button>

						<button
							onClick={onClose}
							className="w-full py-2 text-slate-400 font-semibold hover:text-slate-600 transition-colors text-sm"
						>
							Cancel
						</button>
					</div>
				</div>

				<div className="mt-8 flex justify-center">
					<div className="w-16 h-1 bg-slate-200 rounded-full" />
				</div>
			</div>
		</div>
	);
};

export default GoogleTermsModal;

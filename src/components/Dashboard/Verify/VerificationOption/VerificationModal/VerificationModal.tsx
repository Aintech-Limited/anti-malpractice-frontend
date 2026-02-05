'use client';
import { useAuth } from '@/src/providers/auth/AuthContext';
import { X, BookCheckIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const VerificationModal = () => {
	const router = useRouter();
	const { signIn, updateUser } = useAuth();

	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const refreshUserData = async () => {
			setLoading(true);
			try {
				const res = await fetch('/api/v1/users', {
					method: 'GET',
					credentials: 'include',
				});

				if (res.ok) {
					const data = await res.json();
					signIn(data.data);
					updateUser(data.data);
					console.log(data.data);
					setLoading(false);
					router.push('/dashboard');
				}
			} catch (error) {
				console.error((error as Error).message);
				setLoading(false);
			}
		};
		refreshUserData();
	}, [router, signIn, updateUser]);
	return (
		/* The Overlay  */
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Semi-transparent background layer */}
			<div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" />

			{/* Modal */}
			<div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
				{/* Close Button  */}
				<div className="flex justify-end">
					<button
						onClick={() => router.push('/dashboard')}
						className={`rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors ${loading ? 'cursor-not-allowed' : ''}`}
						disabled={loading}
					>
						<X size={20} />
					</button>
				</div>

				{/* Modal Content */}
				<div className="flex flex-col items-center text-center">
					{/* Book Icon Container */}
					<div className="mb-4 mt-5 flex h-44 w-44 items-center justify-center rounded-full bg-orange-50 text-orange-500">
						<BookCheckIcon size={120} />
					</div>

					{/* Text Content */}
					<h3 className="mb-2 mt-10 text-xl font-bold text-gray-900">
						Thanks! We&apos;ll review your documents soon.
					</h3>
					<p className="mb-8 mt-10 text-sm text-gray-500 leading-relaxed">
						Document reviewing is fast.
					</p>

					{/* Action Buttons */}
					<div className="flex w-full flex-col gap-3 mb-5">
						<button
							onClick={() => router.push('/dashboard')}
							className={`w-full rounded-4xl bg-blue-700 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 active:scale-[0.98] transition-all ${loading ? 'cursor-not-allowed' : ''}`}
							disabled={loading}
						>
							Got it
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default VerificationModal;

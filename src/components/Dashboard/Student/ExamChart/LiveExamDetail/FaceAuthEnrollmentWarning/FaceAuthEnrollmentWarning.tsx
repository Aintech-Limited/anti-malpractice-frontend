'use client';

import { useEffect, useState } from 'react';
import { FaceAuthEnrollmentWarningProps } from './interface';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { ProtectedRouteEnum } from '@/src/lib/enums';

const FaceAuthEnrollmentWarning = ({
	isOpen,
	onClose,
}: FaceAuthEnrollmentWarningProps) => {
	const router = useRouter();
	const [showEncourageModal, setShowEncourageModal] = useState<boolean>(false);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen) return null;

	const handleCloseMainModal = () => {
		setShowEncourageModal(true);
	};

	const handleContinue = () => {
		toast.info('Redirecting to face authentication enrollment...');
		router.push(ProtectedRouteEnum.FACE_CAPTURE);
	};

	const handleCloseEncourage = () => {
		setShowEncourageModal(false);
		onClose?.();
	};

	const handleEnrollNowFromEncourage = () => {
		toast.info('Starting face verification enrollment process...');
		router.push(ProtectedRouteEnum.FACE_CAPTURE);
	};

	return (
		<>
			<div
				className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-transition"
				style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
			>
				<div className="absolute inset-0 backdrop-blur-md bg-black/30" />

				<div
					className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 ease-out animate-fade-in-up"
					onClick={(e) => e.stopPropagation()}
				>
					<div className="bg-linear-to-r from-amber-50 to-orange-50 px-6 pt-6 pb-2 border-b border-amber-100">
						<div className="flex justify-between items-start">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-red-100 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-red-600"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={2}
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/>
									</svg>
								</div>
								<h2 className="text-xl font-bold text-gray-800">
									Face Authentication Required
								</h2>
							</div>
							<button
								onClick={handleCloseMainModal}
								className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
								aria-label="Close"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M6 18L18 6M6 6l12 12"
									/>
								</svg>
							</button>
						</div>
					</div>

					<div className="px-6 py-5">
						<div className="mb-4">
							<div className="flex items-start gap-2 mb-3">
								<span className="text-2xl">⚠️</span>
								<p className="text-gray-700 text-base leading-relaxed">
									You are{' '}
									<span className="font-semibold text-amber-700">
										yet to enroll
									</span>{' '}
									for{' '}
									<strong className="text-indigo-700">
										face authentication / verification
									</strong>
									.
								</p>
							</div>
							<div className="bg-amber-50 rounded-lg p-3 border-l-4 border-amber-400 my-3">
								<p className="text-sm text-gray-700">
									<span className="font-medium">📌 Enrollment Required:</span>{' '}
									To prevent impersonation and ensure academic integrity, face
									verification is mandatory{' '}
									<strong>before starting any exam</strong>. Please complete
									enrollment now.
								</p>
							</div>
							<p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								Secure & encrypted facial recognition
							</p>
						</div>
					</div>

					{/* Continue & Close */}
					<div className="px-6 pb-6 flex flex-col sm:flex-row gap-3 justify-end">
						<button
							onClick={handleContinue}
							className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-md transition-all duration-200 flex items-center justify-center gap-2 focus:ring-2 focus:ring-indigo-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M14 5l7 7m0 0l-7 7m7-7H3"
								/>
							</svg>
							Continue
						</button>
						<button
							onClick={handleCloseMainModal}
							className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
						>
							Close
						</button>
					</div>
				</div>
			</div>

			{showEncourageModal && (
				<div className="fixed inset-0 z-60 flex items-center justify-center p-4">
					<div
						className="absolute inset-0 bg-black/50 backdrop-blur-sm"
						onClick={(e) => e.stopPropagation()}
					/>
					<div
						className="relative z-70 w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-200 scale-100"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="bg-linear-to-r from-emerald-50 to-teal-50 px-5 pt-5 pb-2 border-b border-emerald-100">
							<div className="flex items-center gap-2">
								<div className="p-1.5 bg-emerald-100 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-5 w-5 text-emerald-700"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
										/>
									</svg>
								</div>
								<h3 className="text-lg font-bold text-gray-800">
									Don&apos;t miss out! You really do need to enroll
								</h3>
							</div>
						</div>

						<div className="px-5 py-4">
							<p className="text-gray-700 text-sm leading-relaxed mb-3">
								<strong>Face authentication</strong> protects your exam identity
								and prevents cheating. Without enrollment, you{' '}
								<span className="text-red-600 font-semibold">
									won&apos;t be able to start any test
								</span>
								.
							</p>
							<div className="bg-blue-50 rounded-lg p-3 my-2 text-xs text-blue-800 flex gap-2 items-start">
								<span>🔐</span>
								<span>
									One-time quick setup: take a live selfie & verify identity —
									takes less than 1 minute.
								</span>
							</div>
							<p className="text-sm text-gray-600 mt-2">
								You will be guided through the enrollment flow.
							</p>
						</div>

						<div className="px-5 pb-5 flex gap-3 justify-end">
							<button
								onClick={handleCloseEncourage}
								className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition"
							>
								Remind Later
							</button>
							<button
								onClick={handleEnrollNowFromEncourage}
								className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow transition-all flex items-center gap-1"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-4 w-4"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
									/>
								</svg>
								Enroll Now
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default FaceAuthEnrollmentWarning;

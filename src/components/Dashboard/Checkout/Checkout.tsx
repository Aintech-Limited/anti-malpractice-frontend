'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Loader, ArrowLeft } from 'lucide-react';
import { ICheckoutClientProps } from './interface';

const Checkout = ({
	provider,
	transactionRef,
	transactionId,
	status,
	materialType,
}: ICheckoutClientProps) => {
	const router = useRouter();
	const [verifying, setVerifying] = useState(true);
	const [materialId, setMaterialId] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [countdown, setCountdown] = useState(8);
	console.log('status: ', status);
	const path =
		materialType === 'EXAM_REGISTRATION'
			? `/dashboard/students/exams/registered?purchased=${materialId}`
			: `/dashboard/students/courses/registered?purchased=${materialId}`;

	useEffect(() => {
		if (!transactionRef || !transactionId || !materialType) return;
		verifyPayment();
	}, [transactionId, transactionRef, materialType]);

	const verifyPayment = async () => {
		try {
			setVerifying(true);

			const url =
				materialType === 'EXAM_REGISTRATION'
					? '/api/v1/purchase/verify/exam-registrations'
					: '/api/v1/purchase/verify/course-materials';

			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					provider,
					transactionRef,
					transactionId,
				}),
				credentials: 'include',
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setSuccess(true);
				startCountdown();
				setMaterialId(data.data.materialId);
			} else {
				setError(data.message || 'Payment verification failed');
			}
		} catch (err) {
			setError('An error occurred while verifying your payment');
			console.error('Verification error:', err);
		} finally {
			setVerifying(false);
		}
	};

	const startCountdown = () => {
		const timer = setInterval(() => {
			setCountdown((prev) => {
				if (prev <= 1) {
					clearInterval(timer);
					router.push(path);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);
	};

	const handleContinue = () => {
		router.push(path);
	};

	const handleRetry = () => {
		router.push(encodeURI(window.location.href));
	};

	if (status === 'invalid') {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<Loader className="w-60 h-60 text-red-600 animate-spin mx-auto mb-6" />
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">
						Invalid Request
					</h2>
					<p className="text-gray-600">Cannot confirm your transaction...</p>
					<p className="text-sm text-gray-500 mt-4">
						Transaction Reference: {transactionRef ?? 'N/A'}
					</p>
					<div className="space-y-3 pt-5">
						<button
							onClick={handleRetry}
							className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
						>
							Try Again
						</button>
						<button
							onClick={() => router.push('/support')}
							className="w-full px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
						>
							Contact Support
						</button>
					</div>
				</div>
			</div>
		);
	}
	if (verifying) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="text-center">
					<Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-6" />
					<h2 className="text-2xl font-semibold text-gray-900 mb-2">
						Verifying Your Payment
					</h2>
					<p className="text-gray-600">
						Please wait while we confirm your transaction...
					</p>
					<p className="text-sm text-gray-500 mt-4">
						Transaction Reference: {transactionRef}
					</p>
				</div>
			</div>
		);
	}

	if (success) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-50">
				<div className="max-w-md w-full mx-auto p-8">
					<div className="bg-white rounded-xl shadow-sm p-8 text-center">
						<div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
							<CheckCircle className="w-12 h-12 text-green-600" />
						</div>

						<h2 className="text-2xl font-bold text-gray-900 mb-2">
							Payment Successful!
						</h2>
						<p className="text-gray-600 mb-6">
							Your payment has been verified. You now have access to the
							material.
						</p>

						<div className="bg-gray-50 rounded-lg p-4 mb-6">
							<p className="text-sm text-gray-600 mb-1">
								Transaction Reference
							</p>
							<code className="text-sm font-mono text-gray-900">
								{transactionRef}
							</code>
						</div>

						<button
							onClick={handleContinue}
							className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
						>
							Continue to Course ({countdown}s)
						</button>

						<p className="text-xs text-gray-500 mt-4">
							You&apos;ll be redirected automatically in {countdown} seconds
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="max-w-md w-full mx-auto p-8">
				<div className="bg-white rounded-xl shadow-sm p-8 text-center">
					<div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
						<XCircle className="w-12 h-12 text-red-600" />
					</div>

					<h2 className="text-2xl font-bold text-gray-900 mb-2">
						Verification Failed
					</h2>
					<p className="text-gray-600 mb-6">
						{error ||
							'Unable to verify your payment. Please try again or contact support.'}
					</p>

					<div className="space-y-3">
						<button
							onClick={handleRetry}
							className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
						>
							Try Again
						</button>
						<button
							onClick={() => router.push('/support')}
							className="w-full px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
						>
							Contact Support
						</button>
					</div>

					<div className="mt-6 pt-6 border-t border-gray-200">
						<button
							onClick={() =>
								router.push('/dashboard/students/courses/registered')
							}
							className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-gray-900"
						>
							<ArrowLeft className="w-4 h-4" />
							Back to My Courses
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Checkout;

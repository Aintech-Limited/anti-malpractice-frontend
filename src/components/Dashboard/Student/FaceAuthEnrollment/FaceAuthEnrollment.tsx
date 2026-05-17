'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FaceCapture from '@/src/components/Dashboard/Student/FaceAuthEnrollment/FaceCapture/FaceCapture';
import { useAuth } from '@/src/providers/auth/AuthContext';
import { toast } from 'react-toastify';
import { ProtectedRouteEnum } from '@/src/lib/enums';

const FaceAuthEnrollment = () => {
	const router = useRouter();
	const [showEnrollment, setShowEnrollment] = useState<boolean>(false);
	const { updateUser, user } = useAuth();

	useEffect(() => {
		if (user?.faceAuthEnabled) {
			toast.info('Face ID already enabled');
			router.push(ProtectedRouteEnum.STUDENTS);
		}
	}, [router, user]);

	const handleEnrollmentComplete = async (data: {
		success: boolean;
		backupCodes?: string[];
		message: string;
	}) => {
		console.log('Enrollment complete:', data);
		if (data.success) {
			const response = await fetch('/api/v1/users', {
				method: 'GET',
				credentials: 'include',
			});
			const data = await response.json();
			if (response.ok) {
				updateUser(data.data);
			}
			toast.success('Face ID captured successfully!');
			router.push(ProtectedRouteEnum.STUDENTS);
		}
	};

	const handleCancel = () => {
		router.back();
	};

	return (
		<div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 py-12 px-4">
			<div className="max-w-7xl mx-auto">
				<header className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
						Security Settings
					</h1>
					<p className="text-gray-600 dark:text-gray-300">
						Set up face authentication for secured and better Identification
					</p>
				</header>

				<div className="max-w-3xl mx-auto">
					{showEnrollment ? (
						<FaceCapture
							onEnrollmentComplete={handleEnrollmentComplete}
							onCancel={handleCancel}
						/>
					) : (
						<div className="text-center">
							<p className="text-gray-600 dark:text-gray-300">
								Face enrollment not available
							</p>
						</div>
					)}
				</div>

				{/* Security information */}
				<div className="mt-12 max-w-3xl mx-auto">
					<div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
						<h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
							About Face Authentication
						</h3>
						<div className="grid md:grid-cols-3 gap-6">
							<div className="space-y-2">
								<div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-2">
									<span className="text-blue-600 dark:text-blue-400 font-bold">
										✓
									</span>
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white">
									Secure
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Uses advanced facial recognition and encryption
								</p>
							</div>
							<div className="space-y-2">
								<div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-2">
									<span className="text-green-600 dark:text-green-400 font-bold">
										⚡
									</span>
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white">
									Fast
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									Login in seconds with just your face
								</p>
							</div>
							<div className="space-y-2">
								<div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-2">
									<span className="text-purple-600 dark:text-purple-400 font-bold">
										🔒
									</span>
								</div>
								<h4 className="font-semibold text-gray-900 dark:text-white">
									Private
								</h4>
								<p className="text-sm text-gray-600 dark:text-gray-400">
									We only store encrypted face templates, not images
								</p>
							</div>
						</div>
					</div>
					<div className="text-center pt-4">
						<button
							className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
							type="button"
							onClick={() => setShowEnrollment(true)}
						>
							Continue
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default FaceAuthEnrollment;

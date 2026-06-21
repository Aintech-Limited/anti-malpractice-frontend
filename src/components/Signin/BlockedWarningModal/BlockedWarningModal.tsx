'use client';
import { useEffect, useState } from 'react';
import { BlockedWarningModalProps } from './interface';
import { useAuth } from '@/src/providers/auth/AuthContext';
import { toast } from 'react-toastify';
import { HelpCircle, Mail, User, X } from 'lucide-react';

const BlockedWarningModal: React.FC<BlockedWarningModalProps> = ({
	isOpen,
	onClose,
	adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL,
}) => {
	const { user: studentData } = useAuth();
	const [reason, setReason] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [emailSent, setEmailSent] = useState(false);

	// Prevent body scroll when modal is open
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

	const handleSubmitEmail = async () => {
		setIsSubmitting(true);

		const emailSubject = `Blocked Account Appeal - ${studentData?.firstName}`;
		const emailBody = `
    Dear Admin,

    I am writing to appeal the block on my exam account.

    Student Information:
    - Full Name: ${studentData?.firstName} ${studentData?.lastName}
    - Registered Email: ${studentData?.email}
    - Matric Number: ${studentData?.id || 'Not provided'}

    Reason for believing I was blocked:
    ${reason || 'No reason provided'}

    Please review my case and let me know if there's any additional information needed.

    Thank you for your understanding.

    Best regards,
    ${studentData?.firstName} ${studentData?.lastName}
    `;

		// Create mailto link
		const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(
			emailSubject,
		)}&body=${encodeURIComponent(emailBody)}`;

		try {
			// Try to open email client
			window.location.href = mailtoLink;
			setEmailSent(true);

			await fetch('/api/v1/report-block-appeal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					studentData,
					reason,
					adminEmail,
					timestamp: new Date().toISOString(),
				}),
			});
		} catch (error) {
			console.error('Failed to open email client:', error);
			toast.error(
				'Unable to open email client. Please manually send an email to: ' +
					adminEmail,
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleCopyEmail = () => {
		navigator.clipboard.writeText(adminEmail);
		alert('Admin email copied to clipboard!');
	};

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				<div className="absolute inset-0 backdrop-blur-md bg-black/50" />

				{/* Modal Container */}
				<div className="relative z-10 w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-fade-in-up">
					<div className="bg-linear-to-r from-red-600 to-red-700 px-6 py-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="p-2 bg-white/20 rounded-full">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6 text-white"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
										/>
									</svg>
								</div>
								<h2 className="text-xl font-bold text-white">
									Account Blocked
								</h2>
							</div>
							{onClose && (
								<button
									onClick={onClose}
									className="text-white/80 hover:text-white transition-colors"
									aria-label="Close"
								>
									<X className="h-6 w-6" />
								</button>
							)}
						</div>
					</div>

					{/* Body Content */}
					<div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
						{/* Warning Message */}
						<div className="mb-5 p-4 bg-red-50 rounded-lg border border-red-200">
							<p className="text-red-800 text-sm font-medium mb-2">
								⚠️ Your account has been temporarily blocked by the
								administrator.
							</p>
							<p className="text-gray-700 text-sm">
								You cannot access exams or submit answers until the issue is
								resolved. Please contact the admin to request unblocking.
							</p>
						</div>

						{/* Contact Admin Section */}
						<div className="mb-5">
							<h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<Mail className="h-5 w-5 text-red-600" />
								Contact Administrator
							</h3>

							<div className="bg-gray-50 rounded-lg p-3 mb-3">
								<p className="text-sm text-gray-600 mb-2">Send an email to:</p>
								<div className="flex items-center justify-between bg-white rounded-lg border p-2">
									<code className="text-sm text-blue-600 font-mono">
										{adminEmail}
									</code>
									<button
										onClick={handleCopyEmail}
										className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition-colors"
									>
										Copy
									</button>
								</div>
							</div>
						</div>

						{/* Student Information Display */}
						<div className="mb-5">
							<h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<User className="h-5 w-5 text-gray-600" />
								Your Information
							</h3>

							<div className="space-y-2 bg-gray-50 rounded-lg p-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Full Name:</span>
									<span className="font-medium text-gray-800">
										{studentData?.lastName ?? ''} {studentData?.firstName}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Registered Email:</span>
									<span className="font-medium text-gray-800">
										{studentData?.email || 'Not provided'}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Matric Number:</span>
									<span className="font-medium text-gray-800">N/A</span>
								</div>

								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Department:</span>
									<span className="font-medium text-gray-800">N/A</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">Level:</span>
									<span className="font-medium text-gray-800">N/A</span>
								</div>
							</div>
						</div>

						{/* Reason Input */}
						<div className="mb-5">
							<h3 className="text-md font-semibold text-gray-800 mb-3 flex items-center gap-2">
								<HelpCircle className="h-5 w-5 text-gray-600" />
								Why do you think you were blocked?
							</h3>

							<textarea
								value={reason}
								onChange={(e) => setReason(e.target.value)}
								placeholder="e.g., I was in the middle of my exam when my internet disconnected, or I believe there was a misunderstanding..."
								rows={4}
								className="w-full px-3 py-2 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
							/>
							<p className="text-xs text-gray-500 mt-1">
								Optional but recommended. Including details will help the admin
								understand your situation.
							</p>
						</div>

						{/* Email Preview */}
						{reason && (
							<div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
								<p className="text-xs text-blue-800 font-medium mb-2">
									📧 Email Preview:
								</p>
								<p className="text-xs text-gray-600 wrap-break-word">
									To: {adminEmail}
									<br />
									Subject: Blocked Account Appeal - {
										studentData?.firstName
									}{' '}
									{studentData?.lastName}
									<br />
									Body: Includes your information and reason: &quot;
									{reason.substring(0, 100)}...&quot;
								</p>
							</div>
						)}
					</div>

					{/* Footer Buttons */}
					<div className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row gap-3">
						<button
							onClick={handleSubmitEmail}
							disabled={isSubmitting}
							className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							<Mail className="h-5 w-5" />
							{isSubmitting
								? 'Preparing Email...'
								: emailSent
									? 'Email Opened ✓'
									: 'Send Appeal Email'}
						</button>

						{onClose && (
							<button
								onClick={onClose}
								className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2.5 px-4 rounded-xl transition-all duration-200"
							>
								Close
							</button>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default BlockedWarningModal;

'use client';

import { useState, useRef, useEffect } from 'react';
import {
	AlertCircle,
	Camera,
	CheckCircle,
	Loader2,
	User,
	XCircle,
	Shield,
	Save,
	RefreshCw,
} from 'lucide-react';
import Image from 'next/image';
import { BackupCode, EnrollmentStep, IFaceCaptureProps } from './interface';
import { enrollmentSteps } from './data';
import { detectBlur } from '@/src/lib/helper';

const FaceCapture = ({ onEnrollmentComplete, onCancel }: IFaceCaptureProps) => {
	const [currentStep, setCurrentStep] =
		useState<EnrollmentStep['id']>('instructions');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [captureQuality, setCaptureQuality] = useState<number>(0);
	const [backupCodes, setBackupCodes] = useState<BackupCode[]>([]);
	const [cameraPermission, setCameraPermission] = useState<
		'granted' | 'denied' | 'pending'
	>('pending');
	const [cameraDevices, setCameraDevices] = useState<MediaDeviceInfo[]>([]);
	const [selectedCamera, setSelectedCamera] = useState<string>('');

	// Refs
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const streamRef = useRef<MediaStream | null>(null);

	// Initialize camera
	useEffect(() => {
		return () => {
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, []);

	useEffect(() => {
		if (currentStep !== 'camera') return;
		const getCameraDevices = async () => {
			try {
				const devices = await navigator.mediaDevices.enumerateDevices();
				const videoDevices = devices.filter(
					(device) => device.kind === 'videoinput',
				);

				setCameraDevices(videoDevices);

				if (videoDevices.length > 0 && !selectedCamera) {
					setSelectedCamera(videoDevices[0].deviceId);
				}
			} catch (err) {
				console.error('Error getting camera devices:', err);
			}
		};

		const startCamera = async () => {
			await new Promise((resolve) => setTimeout(resolve, 200));
			try {
				stopCamera(); // clean old stream

				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						facingMode: 'user',
						width: { ideal: 1280 },
						height: { ideal: 720 },
					},
					audio: false,
				});
				console.log(stream.getVideoTracks()[0].readyState);

				streamRef.current = stream;

				if (videoRef.current) {
					videoRef.current.srcObject = stream;
					videoRef.current.onloadedmetadata = async () => {
						await videoRef.current?.play();
					};
				}

				setCameraPermission('granted');

				await getCameraDevices();
			} catch (err) {
				console.error('Error accessing camera:', err);
				setCameraPermission('denied');
				setError(
					'Camera access denied. Please allow camera permissions to continue.',
				);
				setCurrentStep('error');
			}
		};

		startCamera();

		return () => stopCamera();
	}, [currentStep, selectedCamera]);

	const startFaceCapture = () => {
		setCurrentStep('camera');
	};

	// Stop camera
	const stopCamera = () => {
		if (streamRef.current) {
			streamRef.current.getTracks().forEach((track) => track.stop());
			streamRef.current = null;
		}
		if (videoRef.current) {
			videoRef.current.srcObject = null;
		}
	};

	// Capture image from video
	const captureImage = () => {
		if (!videoRef.current || !canvasRef.current) return;

		const video = videoRef.current;
		const canvas = canvasRef.current;
		const context = canvas.getContext('2d');

		if (!context) return;
		// quality check

		const quality = detectBlur(canvas);

		setCaptureQuality(quality);

		// Set canvas dimensions to match video
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		// Draw video frame to canvas
		context.drawImage(video, 0, 0, canvas.width, canvas.height);

		// Get image data URL
		const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
		setCapturedImage(imageDataUrl);

		setCurrentStep('capture');
	};

	// Retry capture
	const retryCapture = () => {
		setCapturedImage(null);
		setCaptureQuality(0);
		setCurrentStep('camera');
	};

	// Submit enrollment
	const submitEnrollment = async () => {
		if (!capturedImage) {
			setError('No image captured');
			setCurrentStep('error');
			return;
		}

		setIsLoading(true);
		setError(null);
		setCurrentStep('processing');

		try {
			// Convert base64 image to blob
			const base64Data = capturedImage.split(',')[1];
			const blob = await fetch(`data:image/jpeg;base64,${base64Data}`).then(
				(res) => res.blob(),
			);

			const formData = new FormData();
			formData.append('file', blob, 'face.jpg');

			// Send to backend
			const response = await fetch(`/api/v1/auth/face-enroll`, {
				method: 'POST',
				credentials: 'include',
				body: formData,
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Enrollment failed');
			}

			if (data.backupCodes) {
				const codes: BackupCode[] = data.backupCodes.map(
					(code: string, index: number) => ({
						id: `code-${index}`,
						code,
						used: false,
					}),
				);
				setBackupCodes(codes);
			}

			setSuccessMessage(data.message || 'Face enrollment successful');
			setCurrentStep('success');

			// Call completion callback
			if (onEnrollmentComplete) {
				await onEnrollmentComplete({
					success: true,
					backupCodes: data.backupCodes,
					message: data.message,
				});
			}

			// Stop camera after success
			stopCamera();
		} catch (err: any) {
			console.error('Enrollment error:', err);
			setError(err.message || 'Failed to enroll face');
			setCurrentStep('error');
		} finally {
			setIsLoading(false);
		}
	};

	// Download backup codes
	const downloadBackupCodes = () => {
		if (!backupCodes.length) return;

		const codesText = backupCodes.map((code) => code.code).join('\n');
		const blob = new Blob([codesText], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'face-auth-backup-codes.txt';
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};

	// Copy backup codes to clipboard
	const copyBackupCodes = async () => {
		if (!backupCodes.length) return;

		const codesText = backupCodes.map((code) => code.code).join('\n');
		try {
			await navigator.clipboard.writeText(codesText);
			alert('Backup codes copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	};

	// Render current step
	const renderStep = () => {
		const step = enrollmentSteps.find((s) => s.id === currentStep);

		switch (currentStep) {
			case 'instructions':
				return (
					<div className="text-center space-y-6">
						<div className="bg-blue-50 dark:bg-blue-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
							<Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
						</div>
						<div>
							<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								{step?.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								{step?.description}
							</p>
						</div>

						<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 text-left">
							<div className="flex items-start">
								<AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 shrink-0" />
								<div>
									<h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
										Important Security Notes
									</h4>
									<ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
										<li>• Use good, natural lighting - avoid backlighting</li>
										<li>• Remove sunglasses, hats, or face coverings</li>
										<li>• Look directly at the camera</li>
										<li>• Keep your face within the frame</li>
										<li>• Save your backup codes in a secure location</li>
									</ul>
								</div>
							</div>
						</div>

						<div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
							<button
								// onClick={startEnrollment}
								onClick={startFaceCapture}
								className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center"
							>
								<Camera className="w-5 h-5 mr-2" />
								Start Face Enrollment
							</button>
							{onCancel && (
								<button
									onClick={onCancel}
									className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
								>
									Cancel
								</button>
							)}
						</div>
					</div>
				);

			case 'camera':
			case 'capture':
				return (
					<div className="space-y-6">
						<div className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4">
							<div className="relative aspect-video rounded-lg overflow-hidden bg-black">
								{cameraPermission === 'granted' ? (
									<>
										<video
											ref={videoRef}
											autoPlay
											playsInline
											muted
											className="w-full h-full object-cover"
										/>
										{/* Face guide overlay */}
										<div className="absolute inset-0 flex items-center justify-center">
											<div className="w-64 h-64 border-2 border-white/30 rounded-full relative">
												<div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/50 rounded-full"></div>
												<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white/50 rounded-full"></div>
												<div className="absolute top-1/2 -left-1 transform -translate-y-1/2 w-4 h-4 bg-white/50 rounded-full"></div>
												<div className="absolute top-1/2 -right-1 transform -translate-y-1/2 w-4 h-4 bg-white/50 rounded-full"></div>
											</div>
										</div>
									</>
								) : (
									<div className="w-full h-full flex flex-col items-center justify-center text-white">
										<Camera className="w-16 h-16 mb-4 opacity-50" />
										<p className="text-lg font-medium">
											Camera Access Required
										</p>
										<p className="text-sm opacity-75 mt-1">
											Please allow camera permissions
										</p>
									</div>
								)}
							</div>

							<canvas ref={canvasRef} className="hidden" />

							{/* Camera selection */}
							{cameraDevices.length > 1 && (
								<div className="mt-4">
									<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
										Select Camera
									</label>
									<select
										value={selectedCamera}
										onChange={(e) => setSelectedCamera(e.target.value)}
										className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
									>
										{cameraDevices.map((device) => (
											<option key={device.deviceId} value={device.deviceId}>
												{device.label ||
													`Camera ${device.deviceId.slice(0, 8)}`}
											</option>
										))}
									</select>
								</div>
							)}
						</div>

						{capturedImage ? (
							// Captured image preview
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<h4 className="font-medium text-gray-900 dark:text-white">
										Captured Image
									</h4>
									{captureQuality > 0 && (
										<div
											className={`px-3 py-1 rounded-full text-sm font-medium ${
												captureQuality >= 80
													? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
													: captureQuality >= 60
														? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
														: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
											}`}
										>
											Quality: {Math.round(captureQuality)}%
										</div>
									)}
								</div>

								<div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
									<Image
										src={capturedImage}
										alt="Captured face"
										className="w-full h-48 object-cover"
										width={180}
										height={80}
									/>
								</div>

								{captureQuality < 70 && (
									<div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
										<div className="flex items-start">
											<AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 shrink-0" />
											<p className="text-sm text-yellow-700 dark:text-yellow-300">
												Image quality is low. For better security, try again
												with better lighting.
											</p>
										</div>
									</div>
								)}

								<div className="flex flex-col sm:flex-row gap-3 pt-2">
									<button
										onClick={submitEnrollment}
										disabled={isLoading}
										className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center"
									>
										{isLoading ? (
											<>
												<Loader2 className="w-5 h-5 mr-2 animate-spin" />
												Processing...
											</>
										) : (
											<>
												<Save className="w-5 h-5 mr-2" />
												Use This Image
											</>
										)}
									</button>
									<button
										onClick={retryCapture}
										disabled={isLoading}
										className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors flex items-center justify-center"
									>
										<RefreshCw className="w-5 h-5 mr-2" />
										Retry Capture
									</button>
								</div>
							</div>
						) : (
							// Capture button
							<div className="text-center space-y-4">
								<button
									onClick={captureImage}
									disabled={cameraPermission !== 'granted'}
									className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center mx-auto"
								>
									<Camera className="w-6 h-6 mr-2" />
									Capture Image
								</button>

								<p className="text-sm text-gray-500 dark:text-gray-400">
									Position your face within the circle and click capture
								</p>
							</div>
						)}
					</div>
				);

			case 'processing':
				return (
					<div className="text-center space-y-6">
						<div className="relative">
							<div className="w-24 h-24 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mx-auto"></div>
							<div className="absolute inset-0 flex items-center justify-center">
								<User className="w-12 h-12 text-blue-600 dark:text-blue-400" />
							</div>
						</div>

						<div>
							<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								{step?.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								{step?.description}
							</p>
						</div>

						<div className="space-y-2">
							<div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Analyzing facial features...
							</div>
							<div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Creating secure template...
							</div>
							<div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400">
								<Loader2 className="w-4 h-4 mr-2 animate-spin" />
								Finalizing enrollment...
							</div>
						</div>
					</div>
				);

			case 'success':
				return (
					<div className="space-y-6">
						<div className="text-center">
							<div className="bg-green-50 dark:bg-green-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
								<CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
							</div>

							<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								{step?.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-300 mb-6">
								{successMessage || step?.description}
							</p>
						</div>

						{backupCodes.length > 0 && (
							<div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5">
								<div className="flex items-center justify-between mb-4">
									<div>
										<h4 className="font-bold text-gray-900 dark:text-white">
											Backup Codes
										</h4>
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
											Save these codes in a secure location. Each code can be
											used once if face login fails.
										</p>
									</div>
									<Shield className="w-8 h-8 text-blue-500" />
								</div>

								<div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
									{backupCodes.map((code) => (
										<div
											key={code.id}
											className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-center font-mono font-bold tracking-wider"
										>
											{code.code}
										</div>
									))}
								</div>

								<div className="flex flex-col sm:flex-row gap-3">
									<button
										onClick={downloadBackupCodes}
										className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
									>
										Download Codes
									</button>
									<button
										onClick={copyBackupCodes}
										className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
									>
										Copy to Clipboard
									</button>
								</div>

								<div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
									<div className="flex items-start">
										<AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2 shrink-0" />
										<p className="text-sm text-yellow-700 dark:text-yellow-300">
											⚠️ These codes will only be shown once. Save them securely
											now!
										</p>
									</div>
								</div>
							</div>
						)}

						<div className="text-center pt-4">
							<button
								onClick={() =>
									onEnrollmentComplete?.({
										success: true,
										backupCodes: backupCodes.map((c) => c.code),
										message: successMessage || 'Enrollment complete',
									})
								}
								className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
							>
								Continue to Dashboard
							</button>
						</div>
					</div>
				);

			case 'error':
				return (
					<div className="text-center space-y-6">
						<div className="bg-red-50 dark:bg-red-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
							<XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
						</div>

						<div>
							<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
								{step?.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-300 mb-2">
								{step?.description}
							</p>
							{error && (
								<p className="text-red-600 dark:text-red-400 font-medium">
									Error: {error}
								</p>
							)}
						</div>

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								onClick={retryCapture}
								className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
							>
								Try Again
							</button>
							{onCancel && (
								<button
									onClick={onCancel}
									className="px-6 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-lg transition-colors"
								>
									Cancel
								</button>
							)}
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	// Progress indicator
	const progress = enrollmentSteps.findIndex((s) => s.id === currentStep);
	const totalSteps = enrollmentSteps.length - 2;

	return (
		<div className="max-w-2xl mx-auto">
			{/* Progress bar */}
			{currentStep !== 'success' && currentStep !== 'error' && (
				<div className="mb-8">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Step {progress + 1} of {totalSteps}
						</span>
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							{Math.round(((progress + 1) / totalSteps) * 100)}%
						</span>
					</div>
					<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
						<div
							className="bg-blue-600 h-2 rounded-full transition-all duration-300"
							style={{ width: `${((progress + 1) / totalSteps) * 100}%` }}
						/>
					</div>
					<div className="flex justify-between mt-2">
						{enrollmentSteps.slice(0, totalSteps).map((step, index) => (
							<div
								key={step.id}
								className={`text-xs font-medium ${
									index <= progress
										? 'text-blue-600 dark:text-blue-400'
										: 'text-gray-400 dark:text-gray-500'
								}`}
							>
								{step.title}
							</div>
						))}
					</div>
				</div>
			)}

			{/* Main */}
			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8">
				{renderStep()}
			</div>

			{/* Footer */}
			{(currentStep === 'instructions' ||
				currentStep === 'camera' ||
				currentStep === 'capture') && (
				<div className="mt-6 text-center">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Your face data is encrypted and stored securely. We never store raw
						images.
					</p>
				</div>
			)}
		</div>
	);
};

export default FaceCapture;

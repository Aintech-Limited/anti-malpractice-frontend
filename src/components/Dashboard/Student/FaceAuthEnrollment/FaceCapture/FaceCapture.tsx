'use client';

import { useState, useRef, useEffect } from 'react';
import {
	BackupCode,
	EnrollmentStep,
	IFaceCaptureProps,
	IFaceVerificationResponse,
} from './interface';
import { enrollmentSteps } from './data';
import { detectBlur } from '@/src/lib/helper';
import { Instructions } from './Instructions/Instructions';
import { Processing } from './Processing/Processing';
import { SUccess } from './SUccess/SUccess';
import { Error as ErrorComponent } from './Error/Error';
import { CaptureCamera } from './CaptureCamera/CaptureCamera';
import { toast } from 'react-toastify';

const FaceCapture = ({
	onEnrollmentComplete,
	onCancel,
	isOpen,
	isVerification,
}: IFaceCaptureProps) => {
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
	if (!isOpen) return null;

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
			const URL = isVerification
				? '/api/v1/auth/face-verify'
				: '/api/v1/auth/face-enroll';

			// Send to backend
			const response = await fetch(URL, {
				method: 'POST',
				credentials: 'include',
				body: formData,
			});

			if (!response.ok) {
				throw new Error(
					`Could not complete ${isVerification ? 'Verification' : 'Enrollment'} .${isVerification ? 'Verification' : 'Enrollment'} failed`,
				);
			}

			if (isVerification && onEnrollmentComplete) {
				const data = (await response.json()) as IFaceVerificationResponse;

				const verificationSuccessfull = data?.data?.authenticated ?? false;

				setSuccessMessage(data.message || 'Face verification successful');
				setCurrentStep('success');

				// Stop camera after success
				stopCamera();

				onEnrollmentComplete({
					success: verificationSuccessfull,
					message: data.message,
				});
				return;
			}

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || 'Enrollment failed');
			}

			if (!isVerification && data.backupCodes) {
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

			// Stop camera after success
			stopCamera();
		} catch (err: any) {
			console.error('Enrollment error:', err);
			setError(
				err.message || `Failed to ${isVerification ? 'verify' : 'enroll'} face`,
			);
			setCurrentStep('error');
		} finally {
			setIsLoading(false);
		}
	};

	// Download backup codes
	const downloadBackupCodes = () => {
		if (!backupCodes.length) return;

		try {
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
		} catch (error) {
			toast.error('could not download backup codes');
			console.error('could not download backup codes: ', error);
		}
	};

	// Copy backup codes to clipboard
	const copyBackupCodes = async () => {
		if (!backupCodes.length) return;

		const codesText = backupCodes.map((code) => code.code).join('\n');
		try {
			await navigator.clipboard.writeText(codesText);
			toast.info('Backup codes copied to clipboard!');
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
					<Instructions
						onCancel={onCancel}
						startFaceCapture={startFaceCapture}
						step={step}
					/>
				);

			case 'camera':
			case 'capture':
				return (
					<CaptureCamera
						cameraDevices={cameraDevices}
						cameraPermission={cameraPermission}
						canvasRef={canvasRef}
						captureImage={captureImage}
						captureQuality={captureQuality}
						capturedImage={capturedImage}
						isLoading={isLoading}
						retryCapture={retryCapture}
						selectedCamera={selectedCamera}
						setSelectedCamera={setSelectedCamera}
						submitEnrollment={submitEnrollment}
						videoRef={videoRef}
					/>
				);

			case 'processing':
				return <Processing step={step} />;

			case 'success':
				return (
					<SUccess
						backupCodes={backupCodes}
						copyBackupCodes={copyBackupCodes}
						downloadBackupCodes={downloadBackupCodes}
						isVerification={isVerification ?? false}
						onEnrollmentComplete={onEnrollmentComplete}
						successMessage={successMessage}
						step={step}
					/>
				);

			case 'error':
				return (
					<ErrorComponent
						error={error}
						onCancel={onCancel}
						retryCapture={retryCapture}
						step={step}
					/>
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

			<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 md:p-8">
				{renderStep()}
			</div>

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

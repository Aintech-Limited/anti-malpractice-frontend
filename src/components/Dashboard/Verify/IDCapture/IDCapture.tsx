'use client';

import {
	ChevronLeftCircle,
	HelpCircle,
	CameraIcon,
	RecycleIcon,
	XCircleIcon,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { TVerifyStage } from '../interface';
import { useAppDispatch, useAppSelector } from '@/src/redux/reduxStore';
import { TCaptureStep } from './interface';
import { compressImage, dataURLtoFile, detectBlur } from '@/src/lib/helper';
import {
	setBackImageId,
	setFrontImageId,
	clearVerification,
} from '@/src/redux/features/lecturerVerificationImages/lecturerVerificationImages';
import { KYC_BACK, KYC_FRONT } from '../../../../lib/enums';
import CustomLoadingIcon from '@/src/components/common/LoadingIcon/LoadingIcon';

const IDCapture = ({
	setStage,
}: {
	setStage: (stage: TVerifyStage) => void;
}) => {
	const { photoIdType } = useAppSelector((state) => state.aphotoIdType);
	const dispatch = useAppDispatch();

	const [permissionVisible, setPermissionVisible] = useState(true);

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);

	const [captureStep, setCaptureStep] = useState<TCaptureStep>('FRONT');

	const [frontImage, setFrontImage] = useState<string | null>(null);
	const [backImage, setBackImage] = useState<string | null>(null);

	const [cameraReady, setCameraReady] = useState(false);
	const [flash, setFlash] = useState<boolean>(false);
	const [loading, setLoading] = useState<boolean>(false);

	// Stop Camera When Leaving Page
	useEffect(() => {
		return () => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
			}
		};
	}, []);

	const requestCamera = async () => {
		try {
			// cleanup old stream first
			streamRef.current?.getTracks().forEach((t) => t.stop());

			const stream = await navigator.mediaDevices.getUserMedia({
				video: {
					facingMode: 'environment', // back camera on mobile
					width: { ideal: 1280 },
					height: { ideal: 720 },
				},
				audio: false,
			});

			streamRef.current = stream;

			if (videoRef.current) {
				videoRef.current.srcObject = stream;
				await videoRef.current.play();
				setCameraReady(true);
			}

			setPermissionVisible(false);
		} catch (err) {
			toast.error('Camera permission denied');
			console.error(err);
		}
	};

	const captureFrame = async () => {
		if (!videoRef.current || !canvasRef.current) return;

		setFlash(true);
		setTimeout(() => setFlash(false), 120);

		const video = videoRef.current;
		const canvas = canvasRef.current;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		// detect blurry image
		const blurry = detectBlur(canvas);

		if (blurry < 100) {
			toast.warning('Image is blurry. Hold steady and try again.');
			return;
		}

		const rawImage = canvas.toDataURL('image/jpeg', 1);
		const compressedImage = await compressImage(rawImage);

		if (captureStep === 'FRONT') {
			setFrontImage(compressedImage);
			setCaptureStep('BACK');
			return;
		}

		if (captureStep === 'BACK') {
			setBackImage(compressedImage);
			setCaptureStep('REVIEW');

			// stop camera
			streamRef.current?.getTracks().forEach((t) => t.stop());

			return;
		}
	};

	const handleRetake = async (step: TCaptureStep) => {
		setCaptureStep(step);
		setPermissionVisible(false);
		await requestCamera();
	};

	const handleFocus = async () => {
		const track = streamRef.current?.getVideoTracks()?.[0];

		if (!track) return;

		const capabilities = track.getCapabilities?.() as any;

		// Check browser support safely
		if (capabilities?.focusMode?.includes('continuous')) {
			try {
				await track.applyConstraints({
					advanced: [{ focusMode: 'continuous' }] as any,
				});
			} catch (err) {
				console.warn('Autofocus not supported', err);
			}
		}
	};

	const handleUploadID = async () => {
		if (!frontImage || !backImage) {
			toast.error('Please retake the images');
			return;
		}
		setLoading(true);

		dispatch(setBackImageId('BACK_CAPTURED'));
		dispatch(setFrontImageId('FRONT_CAPTURED'));

		const frontFile = dataURLtoFile(frontImage, 'id-front.jpg');
		const backFile = dataURLtoFile(backImage, 'id-back.jpg');

		const formData = new FormData();
		formData.append(KYC_FRONT, frontFile);
		formData.append(KYC_BACK, backFile);

		try {
			const res = await fetch('/api/v1/kyc', {
				method: 'POST',
				credentials: 'include',
				body: formData,
			});

			if (!res.ok) {
				setLoading(false);
				if (res.status === 409) {
					throw new Error('ID already verified!');
				}
				dispatch(clearVerification());
				const err = await res.json();
				throw new Error(err.message || 'Upload failed');
			}

			toast.success('ID uploaded successfully');
			setStage('VERIFICATION_OPTIONS');
		} catch (err) {
			setLoading(false);
			dispatch(clearVerification());
			console.error(err);
			toast.error('Upload failed');
		}
	};

	return (
		<div className="min-h-screen bg-white flex flex-col items-center font-sans">
			{/* Camera Header */}
			<div className="w-full max-w-lg flex items-center justify-between p-6">
				<ChevronLeftCircle
					size={24}
					onClick={() => {
						if (captureStep === 'FRONT') {
							setStage('GOVERNMENT');
						} else if (captureStep === 'BACK') {
							setCaptureStep('FRONT');
						} else {
							setCaptureStep('BACK');
						}
					}}
					className="cursor-pointer"
				/>
				<h1 className="text-lg font-semibold text-blue-700">
					{captureStep === 'FRONT' && 'Front of card'}
					{captureStep === 'BACK' && 'Back of card'}
					{captureStep === 'REVIEW' && 'Check quality'}
				</h1>
				<HelpCircle size={24} className="text-slate-400" />
			</div>
			{(frontImage || backImage) && (
				<>
					<RecycleIcon
						onClick={() => handleRetake('FRONT')}
						className="text-green-500"
					/>{' '}
					{'Retake'}
				</>
			)}

			<div className="w-full max-w-md px-6 flex-1 flex flex-col items-center justify-center">
				{/* Viewfinder */}
				{captureStep !== 'REVIEW' && (
					<div className="w-full aspect-[1.4/1] relative border-2 border-slate-200 rounded-2xl bg-slate-50 overflow-hidden flex items-center justify-center">
						<video
							ref={videoRef}
							playsInline
							webkit-playsinline="true"
							onClick={handleFocus}
							muted
							autoPlay
							className="absolute inset-0 w-full h-full object-cover"
						/>

						{flash && (
							<div className="absolute inset-0 bg-white z-20 animate-pulse" />
						)}

						{/* Hidden Canvas */}
						<canvas ref={canvasRef} className="hidden" />

						{/* MAKESHIFT SCANNER LINE */}
						{cameraReady && (
							<div className="absolute inset-0 pointer-events-none overflow-hidden">
								<div className="scanner-line" />
							</div>
						)}

						{/* FRAME CAMERA GUIDE */}
						{cameraReady && (
							<div className="absolute inset-0 pointer-events-none">
								<div className="absolute inset-6 border-2 border-blue-500 rounded-xl opacity-70" />

								<p className="absolute bottom-4 w-full text-center text-white text-xs bg-black/40 py-1">
									Align your ID inside the frame
								</p>
							</div>
						)}

						{!permissionVisible && !cameraReady && (
							<div>
								We cannot capture {photoIdType?.replace('_', ' ') || 'Card'}.{' '}
								<br />{' '}
								<span className="font-extrabold text-orange-600">
									You denied Permission.
								</span>
							</div>
						)}

						{/* Permission Popup */}
						{permissionVisible && (
							<div className="absolute inset-0 bg-black/5 flex items-center justify-center px-6">
								<div className="bg-white rounded-4xl p-8 w-full max-w-70 text-center shadow-2xl">
									<h3 className="text-sm font-bold mb-2">
										&ldquo;Exam Guide&rdquo; Would like to Access your Camera
									</h3>
									<p className="text-[10px] text-slate-400 mb-6 leading-relaxed">
										Click on Allow to give access to your camera
									</p>
									<div className="flex border-t border-slate-100 pt-2">
										<button
											onClick={() => setPermissionVisible(false)}
											className="flex-1 text-blue-500 font-medium"
										>
											Don&apos;t Allow
										</button>
										<button
											onClick={requestCamera}
											className="flex-1 text-blue-600 font-bold"
										>
											Allow
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				)}

				<h2 className="text-xl font-bold mt-10 mb-2 text-blue-700">
					{captureStep === 'FRONT' && 'Front of card'}
					{captureStep === 'BACK' && 'Back of card'}
					{captureStep === 'REVIEW' && 'Check quality'}
				</h2>
				<p className="text-slate-400 text-xs text-center max-w-65 mb-20">
					{captureStep !== 'REVIEW'
						? 'Position your ID clearly inside the frame'
						: 'Make sure all details are readable'}
				</p>

				{/* Shutter Controls */}
				<div className="w-full flex items-center justify-center max-w-70 pb-10">
					{captureStep === 'REVIEW' && (
						<div className="space-y-6 w-full">
							{/* FRONT IMAGE DISPLAY */}
							<Image
								src={frontImage!}
								className="rounded-xl border"
								alt="Front preview"
								width={280}
								height={90}
							/>
							{/* BACK IMAGE DISPLAY */}
							<Image
								src={backImage!}
								className="rounded-xl border"
								alt="Back preview"
								width={280}
								height={90}
							/>

							<button
								onClick={handleUploadID}
								className={`w-full bg-blue-600 text-white py-4 rounded-xl font-semibold  flex items-center justify-center gap-2 ${
									loading ? 'opacity-70 cursor-not-allowed' : ''
								}`}
								disabled={loading}
							>
								{loading ? (
									<>
										<CustomLoadingIcon size="md" color="blue" />
										<span>Uploading...</span>
									</>
								) : (
									'All clear, Continue'
								)}
							</button>

							<button
								onClick={() => {
									setFrontImage(null);
									setBackImage(null);
									handleRetake('FRONT');
								}}
								className="w-full text-blue-600 font-medium"
								disabled={loading}
							>
								Take new photo
							</button>
						</div>
					)}
					{captureStep !== 'REVIEW' && (
						<button
							disabled={!cameraReady}
							onClick={captureFrame}
							className="w-20 h-20 rounded-full border-[6px] border-slate-200 p-1"
						>
							{/* <div className="w-full h-full bg-white rounded-full" /> */}
							{(cameraReady && (
								<CameraIcon className="w-full h-full rounded-full bg-blue-600" />
							)) || (
								<XCircleIcon className="w-full h-full rounded-full bg-red-600 cursor-not-allowed" />
							)}
						</button>
					)}
				</div>
			</div>
		</div>
	);
};

export default IDCapture;

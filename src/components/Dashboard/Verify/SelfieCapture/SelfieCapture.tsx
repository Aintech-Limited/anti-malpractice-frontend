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
import { useAppDispatch } from '@/src/redux/reduxStore';
import { compressImage, dataURLtoFile } from '@/src/lib/helper';
import {
	setSelfieImageId,
	clearSelfieImageId,
} from '@/src/redux/features/lecturerVerificationImages/lecturerVerificationImages';
import { KYC_SELFIE } from '../../../../lib/enums';
import CustomLoadingIcon from '@/src/components/common/LoadingIcon/LoadingIcon';

const SelfieCapture = ({
	setStage,
}: {
	setStage: (stage: TVerifyStage) => void;
}) => {
	const dispatch = useAppDispatch();

	const [permissionVisible, setPermissionVisible] = useState(true);

	const videoRef = useRef<HTMLVideoElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const streamRef = useRef<MediaStream | null>(null);

	const [selfieImage, setSelfieImage] = useState<string | null>(null);

	const [cameraReady, setCameraReady] = useState(false);
	const [flash, setFlash] = useState(false);
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

		if (blurry) {
			toast.warning('Image is blurry. Hold steady and try again.');
			return;
		}

		const rawImage = canvas.toDataURL('image/jpeg', 1);
		const compressedImage = await compressImage(rawImage);

		setSelfieImage(compressedImage);

		// stop camera
		streamRef.current?.getTracks().forEach((t) => t.stop());

		return;
	};

	const handleRetake = async () => {
		setPermissionVisible(false);
		setSelfieImage(null);
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

	const detectBlur = (canvas: HTMLCanvasElement) => {
		const ctx = canvas.getContext('2d');
		if (!ctx) return false;

		const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
		let sum = 0;

		for (let i = 0; i < imageData.data.length; i += 4) {
			const gray =
				imageData.data[i] * 0.299 +
				imageData.data[i + 1] * 0.587 +
				imageData.data[i + 2] * 0.114;
			sum += gray;
		}

		const avg = sum / (imageData.data.length / 4);

		return avg < 60; // threshold
	};

	const handleUploadSelfie = async () => {
		if (!selfieImage) {
			toast.error('Please retake the Selfie.');
			return;
		}
		setLoading(true);

		dispatch(setSelfieImageId('SELFIE_CAPTURED'));

		const SelfieFile = dataURLtoFile(selfieImage, 'selfie.jpg');

		const formData = new FormData();
		formData.append(KYC_SELFIE, SelfieFile);

		try {
			const res = await fetch('/api/v1/kyc/selfie', {
				method: 'POST',
				credentials: 'include',
				body: formData,
			});

			if (!res.ok) {
				setLoading(false);
				dispatch(clearSelfieImageId());
				const err = await res.json();
				throw new Error(err.message || 'Upload failed');
			}

			toast.success('Selfie uploaded successfully');
			setStage('VERIFICATION_OPTIONS');
		} catch (err) {
			setLoading(false);
			dispatch(clearSelfieImageId());
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
					onClick={() => setStage('VERIFICATION_OPTIONS')}
					className="cursor-pointer"
				/>
				<h1 className="text-lg font-semibold text-blue-700">Selfie</h1>
				<HelpCircle size={24} className="text-slate-400" />
			</div>
			{selfieImage && (
				<>
					<RecycleIcon
						onClick={() => handleRetake()}
						className="text-green-500"
					/>{' '}
					{'Retake'}
				</>
			)}

			<div className="w-full max-w-md px-6 flex-1 flex flex-col items-center justify-center">
				{/* Viewfinder */}
				{!selfieImage && (
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
									Center your face
								</p>
							</div>
						)}

						{!permissionVisible && !cameraReady && (
							<div>
								We cannot capture your Selfie. <br />{' '}
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
					Center your face
				</h2>
				<p className="text-slate-400 text-xs text-center max-w-65 mb-20">
					{!selfieImage
						? 'Position your ID clearly inside the frame'
						: 'Make sure all details are readable'}
				</p>

				{/* Shutter Controls */}
				<div className="w-full flex items-center justify-center max-w-70 pb-10">
					{selfieImage && (
						<div className="space-y-6 w-full">
							{/* SELFIE IMAGE DISPLAY */}
							<Image
								src={selfieImage!}
								className="rounded-xl border"
								alt="Front preview"
								width={280}
								height={90}
							/>

							<button
								onClick={handleUploadSelfie}
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
									setSelfieImage(null);
									handleRetake();
								}}
								className="w-full text-blue-600 font-medium"
								disabled={loading}
							>
								Take new photo
							</button>
						</div>
					)}
					{!selfieImage && (
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

export default SelfieCapture;

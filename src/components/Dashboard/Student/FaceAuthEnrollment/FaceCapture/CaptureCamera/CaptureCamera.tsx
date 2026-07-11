'use client';

import { AlertCircle, Camera, Loader2, RefreshCw, Save } from 'lucide-react';
import { ICaptureCameraProps } from './interface';
import Image from 'next/image';

export const CaptureCamera = ({
	cameraDevices,
	cameraPermission,
	canvasRef,
	captureImage,
	captureQuality,
	capturedImage,
	isLoading,
	retryCapture,
	selectedCamera,
	setSelectedCamera,
	submitEnrollment,
	videoRef,
}: ICaptureCameraProps) => {
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
							<p className="text-lg font-medium">Camera Access Required</p>
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
									{device.label || `Camera ${device.deviceId.slice(0, 8)}`}
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
									Image quality is low. For better security, try again with
									better lighting.
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
};

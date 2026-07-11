'use client';

import { AlertCircle, Camera, Shield } from 'lucide-react';
import { IInstructionsProps } from './interface';

export const Instructions = ({
	step,
	onCancel,
	startFaceCapture,
}: IInstructionsProps) => {
	return (
		<div className="text-center space-y-6">
			<div className="bg-blue-50 dark:bg-blue-900/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto">
				<Shield className="w-12 h-12 text-blue-600 dark:text-blue-400" />
			</div>
			<div>
				<h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
					{step?.title}
				</h3>
				<p className="text-gray-600 dark:text-gray-300">{step?.description}</p>
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
};

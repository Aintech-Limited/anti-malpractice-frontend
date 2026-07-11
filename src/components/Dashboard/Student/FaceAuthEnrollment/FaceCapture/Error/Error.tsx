'use client';

import { XCircle } from 'lucide-react';
import { IErrorProps } from './interface';

export const Error = ({ error, onCancel, retryCapture, step }: IErrorProps) => {
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
};

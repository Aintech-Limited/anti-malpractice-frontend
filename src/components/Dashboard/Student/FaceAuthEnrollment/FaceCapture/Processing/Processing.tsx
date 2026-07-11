'use client';

import { Loader2, User } from 'lucide-react';
import { EnrollmentStep } from '../interface';

export const Processing = ({ step }: { step?: EnrollmentStep }) => {
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
				<p className="text-gray-600 dark:text-gray-300">{step?.description}</p>
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
};

'use client';

import { Key, Mail, X } from 'lucide-react';
import { IChangePINModalProps } from './interface';

export default function ChangePINModal({
	loading,
	onConfirm,
	onCancel,
}: IChangePINModalProps) {
	return (
		<div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50 animate-fadeIn p-4">
			<div className="bg-white rounded-2xl max-w-md w-full mx-4 transform transition-all animate-slideUp">
				<div className="border-b border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<div className="p-2 bg-indigo-100 rounded-full">
								<Key className="w-6 h-6 text-indigo-600" />
							</div>
							<h2 className="text-2xl font-bold text-gray-800">Change PIN</h2>
						</div>
						<button onClick={onCancel}>
							<X className="w-6 h-6 text-gray-400" />
						</button>
					</div>
					<p className="text-gray-500 text-sm mt-2">
						A verification token will be sent to your email
					</p>
				</div>

				<div className="p-6">
					<div className="bg-blue-50 rounded-lg p-4 mb-4">
						<div className="flex items-start gap-2">
							<Mail className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
							<p className="text-sm text-blue-800">
								A 6-digit verification token will be sent to your registered
								email address.
							</p>
						</div>
					</div>
				</div>

				<div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex gap-3">
					<button
						onClick={onCancel}
						className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onConfirm}
						disabled={loading}
						className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{loading ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							'Send Token'
						)}
					</button>
				</div>
			</div>
		</div>
	);
}

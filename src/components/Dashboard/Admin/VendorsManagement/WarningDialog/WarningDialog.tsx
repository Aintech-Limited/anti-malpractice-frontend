'use client';

import { IWarningDialogProps } from './interface';

export const WarningDialog = ({
	actionLoading,
	closeModal,
	executeAction,
	modal,
}: IWarningDialogProps) => {
	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-10 backdrop-blur-sm">
			<div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl space-y-4 border border-gray-100">
				<div className="flex justify-between items-center border-b pb-3">
					<h3 className="text-lg font-bold capitalize text-gray-900">
						{modal.type} Vendor Warning
					</h3>
					<button
						onClick={closeModal}
						className="text-gray-400 hover:text-gray-600 font-bold"
					>
						✕
					</button>
				</div>

				<p className="text-sm text-gray-600 leading-relaxed">
					Are you sure you want to{' '}
					<strong className="text-blue-600 uppercase">{modal.type}</strong> the
					vendor from{' '}
					<strong>
						{modal.vendor?.institution?.name || 'Unknown Institution'}
					</strong>
					?
					{modal.type === 'remove' && (
						<span className="block mt-2 text-red-600 font-medium">
							Warning: This action is permanent and cannot be undone.
						</span>
					)}
				</p>

				<div className="flex justify-end gap-3 pt-3 border-t">
					<button
						type="button"
						onClick={closeModal}
						disabled={actionLoading}
						className="px-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100 transition"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={executeAction}
						disabled={actionLoading}
						className={`px-4 py-2 rounded-md text-sm font-medium text-white transition flex items-center gap-2 ${
							modal.type === 'remove'
								? 'bg-red-600 hover:bg-red-700'
								: modal.type === 'revoke'
									? 'bg-amber-600 hover:bg-amber-700'
									: 'bg-blue-600 hover:bg-blue-700'
						}`}
					>
						{actionLoading && (
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						)}
						Confirm {modal.type}
					</button>
				</div>
			</div>
		</div>
	);
};

'use client';

import { Lock, X, Eye, EyeOff, Save, AlertCircle } from 'lucide-react';
import { IPasswordModalProps } from './interface';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator/PasswordStrengthIndicator';

export const PasswordModal = ({
	hasPassword,
	showPassword,
	showOldPassword,
	showConfirmPassword,
	loading,
	passwordData,
	passwordErrors,
	onClose,
	onUpdatePassword,
	onPasswordDataChange,
	onTogglePassword,
	onToggleOldPassword,
	onToggleConfirmPassword,
}: IPasswordModalProps) => {
	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
			<div className="bg-white rounded-2xl max-w-md w-full mx-4 transform transition-all animate-slideUp">
				<div className="border-b border-gray-200 p-6 flex justify-between items-center">
					<div className="flex items-center gap-3">
						<Lock className="w-6 h-6 text-indigo-600" />
						<h2 className="text-2xl font-bold text-gray-800">
							{hasPassword ? 'Change Password' : 'Set Password'}
						</h2>
					</div>
					<button
						onClick={onClose}
						className="text-gray-400 hover:text-gray-600 transition-colors"
					>
						<X className="w-6 h-6" />
					</button>
				</div>

				<div className="p-6 space-y-4">
					{!hasPassword && (
						<div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
							<AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
							<p className="text-sm text-blue-800">
								You signed up with Google. Setting a password will allow you to
								login with email as well.
							</p>
						</div>
					)}

					{hasPassword && (
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Current Password
							</label>
							<div className="relative">
								<input
									type={showOldPassword ? 'text' : 'password'}
									value={passwordData.oldPassword}
									onChange={(e) =>
										onPasswordDataChange({ oldPassword: e.target.value })
									}
									className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
										passwordErrors.oldPassword
											? 'border-red-500'
											: 'border-gray-300'
									}`}
									placeholder="Enter current password"
								/>
								<button
									type="button"
									onClick={onToggleOldPassword}
									className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
								>
									{showOldPassword ? (
										<EyeOff className="w-4 h-4" />
									) : (
										<Eye className="w-4 h-4" />
									)}
								</button>
							</div>
							{passwordErrors.oldPassword && (
								<p className="text-red-500 text-xs mt-1">
									{passwordErrors.oldPassword}
								</p>
							)}
						</div>
					)}

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							New Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? 'text' : 'password'}
								value={passwordData.newPassword}
								onChange={(e) =>
									onPasswordDataChange({ newPassword: e.target.value })
								}
								className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
									passwordErrors.newPassword
										? 'border-red-500'
										: 'border-gray-300'
								}`}
								placeholder="Enter new password"
							/>
							<button
								type="button"
								onClick={onTogglePassword}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
							>
								{showPassword ? (
									<EyeOff className="w-4 h-4" />
								) : (
									<Eye className="w-4 h-4" />
								)}
							</button>
						</div>
						{passwordErrors.newPassword && (
							<p className="text-red-500 text-xs mt-1">
								{passwordErrors.newPassword}
							</p>
						)}
						<PasswordStrengthIndicator password={passwordData.newPassword} />
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Confirm New Password
						</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? 'text' : 'password'}
								value={passwordData.confirmPassword}
								onChange={(e) =>
									onPasswordDataChange({ confirmPassword: e.target.value })
								}
								className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
									passwordErrors.confirmPassword
										? 'border-red-500'
										: 'border-gray-300'
								}`}
								placeholder="Confirm new password"
							/>
							<button
								type="button"
								onClick={onToggleConfirmPassword}
								className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
							>
								{showConfirmPassword ? (
									<EyeOff className="w-4 h-4" />
								) : (
									<Eye className="w-4 h-4" />
								)}
							</button>
						</div>
						{passwordErrors.confirmPassword && (
							<p className="text-red-500 text-xs mt-1">
								{passwordErrors.confirmPassword}
							</p>
						)}
					</div>
				</div>

				<div className="border-t border-gray-200 p-6 bg-gray-50 rounded-b-2xl flex gap-3">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
					>
						Cancel
					</button>
					<button
						onClick={onUpdatePassword}
						disabled={loading}
						className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{loading ? (
							<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
						) : (
							<>
								<Save className="w-4 h-4" />
								Update Password
							</>
						)}
					</button>
				</div>
			</div>
		</div>
	);
};

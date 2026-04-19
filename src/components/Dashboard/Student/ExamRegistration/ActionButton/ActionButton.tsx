'use client';

import { getButtonText, isButtonDisabled } from '../utils/examHelpers';
import { IActionButtonProps } from './interface';

export const ActionButton = ({
	exam,
	onRegister,
	onPay,
	onPayLoading,
	onRegisterLoading,
}: IActionButtonProps) => {
	const buttonText = getButtonText(exam);
	const disabled = isButtonDisabled(exam);
	const isRegistered = exam.isRegistered;

	if (isRegistered) {
		return (
			<button
				disabled
				className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg cursor-not-allowed"
			>
				✓ Registered
			</button>
		);
	}
	const now = new Date();

	if (new Date(exam.registrationDeadline) < now) {
		return (
			<button
				disabled
				className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded-lg cursor-not-allowed"
			>
				❌ Closed
			</button>
		);
	}

	if (exam.examRegistrationId && !isRegistered) {
		return (
			<button
				onClick={() => onPay(exam)}
				disabled={disabled || onPayLoading}
				className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 ${
					disabled
						? 'bg-gray-300 text-gray-500 cursor-not-allowed'
						: 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-blue-200'
				}`}
			>
				{onPayLoading ? (
					<>
						<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
						Processing...
					</>
				) : (
					buttonText
				)}
			</button>
		);
	}

	return (
		<button
			onClick={() => onRegister(exam)}
			disabled={disabled || onRegisterLoading}
			className={`px-4 py-2 text-sm font-bold rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
				disabled || onRegisterLoading
					? 'bg-gray-300 text-gray-500 cursor-not-allowed'
					: 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-200'
			}`}
		>
			{onRegisterLoading ? (
				<>
					<span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
					Processing...
				</>
			) : (
				buttonText
			)}
		</button>
	);
};

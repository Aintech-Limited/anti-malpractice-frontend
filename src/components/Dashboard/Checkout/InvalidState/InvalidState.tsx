import { XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { STATUS_MESSAGES } from '../utils/paymentConstants';
import { IInvalidStateProps } from './interface';

export const InvalidState = ({
	transactionRef,
	onRetry,
}: IInvalidStateProps) => {
	const router = useRouter();

	return (
		<div className="text-center">
			<XCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
			<h2 className="text-2xl font-semibold text-gray-900 mb-2">
				{STATUS_MESSAGES.INVALID.title}
			</h2>
			<p className="text-gray-600">{STATUS_MESSAGES.INVALID.description}</p>
			<p className="text-sm text-gray-500 mt-4">
				Transaction Reference: {transactionRef || 'N/A'}
			</p>
			<div className="space-y-3 pt-5 max-w-sm mx-auto">
				<button
					onClick={onRetry}
					className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
				>
					Try Again
				</button>
				<button
					onClick={() => router.push('/support')}
					className="w-full px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
				>
					Contact Support
				</button>
			</div>
		</div>
	);
};

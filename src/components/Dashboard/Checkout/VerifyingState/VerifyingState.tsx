import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { STATUS_MESSAGES } from '../utils/paymentConstants';
import { IVerifyingStateProps } from './interface';

export const VerifyingState = ({ transactionRef }: IVerifyingStateProps) => {
	return (
		<div className="text-center">
			<LoadingSpinner size="lg" color="text-blue-600" />
			<h2 className="text-2xl font-semibold text-gray-900 mb-2 mt-6">
				{STATUS_MESSAGES.VERIFYING.title}
			</h2>
			<p className="text-gray-600">{STATUS_MESSAGES.VERIFYING.description}</p>
			<p className="text-sm text-gray-500 mt-4">
				Transaction Reference: {transactionRef}
			</p>
		</div>
	);
};

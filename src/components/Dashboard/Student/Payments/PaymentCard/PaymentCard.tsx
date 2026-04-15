import { Eye, CreditCard, Calendar, DollarSign } from 'lucide-react';
import {
	getMerchandiseIcon,
	getMerchandiseStyles,
	getStatusColor,
	formatTransactionId,
	getMerchandiseTitle,
	getCourseSubtitle,
} from '../utils/paymentHelpers';
import { formatDate } from '@/src/lib/helper';
import { IPaymentCardProps } from './interface';

export const PaymentCard = ({ payment, onViewDetails }: IPaymentCardProps) => {
	const Icon = getMerchandiseIcon(payment.merchandiseName);
	const { iconColor, bgGradient } = getMerchandiseStyles(
		payment.merchandiseName,
	);
	const statusColor = payment.paymentStatus
		? getStatusColor(payment.paymentStatus)
		: '';
	const merchandiseTitle = getMerchandiseTitle(payment);
	const courseSubtitle = getCourseSubtitle(payment);

	return (
		<div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden group">
			<div className="p-6">
				<div className="flex items-start justify-between">
					<div className="flex items-start gap-4 flex-1">
						<div className={`p-3 ${bgGradient} rounded-xl`}>
							<Icon className={`w-5 h-5 ${iconColor}`} />
						</div>

						<div className="flex-1">
							<div className="flex items-center gap-3 mb-2 flex-wrap">
								{payment.paymentStatus && (
									<span
										className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColor}`}
									>
										{payment.paymentStatus}
									</span>
								)}

								<span className="text-xs text-gray-500 flex items-center gap-1">
									<CreditCard className="w-3 h-3" />
									{payment.paymentProvider}
								</span>

								{payment.transactionId && (
									<span className="text-xs text-gray-500">
										TXN: {formatTransactionId(payment.transactionId)}
									</span>
								)}
							</div>

							<h3 className="text-lg font-semibold text-gray-800 mb-1">
								{merchandiseTitle}
							</h3>

							{courseSubtitle && (
								<p className="text-sm text-gray-600 mb-2">{courseSubtitle}</p>
							)}

							<div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
								{payment.createdAt && (
									<span className="flex items-center gap-1">
										<Calendar className="w-4 h-4" />
										{formatDate(payment.createdAt)}
									</span>
								)}

								<span className="flex items-center gap-1 font-semibold text-gray-700">
									<DollarSign className="w-4 h-4" />
									{payment.amount} {payment.currency}
								</span>
							</div>
						</div>
					</div>

					<button
						onClick={() => onViewDetails(payment)}
						className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
					>
						<Eye className="w-5 h-5" />
					</button>
				</div>
			</div>
		</div>
	);
};

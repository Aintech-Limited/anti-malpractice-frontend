'use client';

import { IPaymentsClientProps } from './interface';
import { usePayments } from './hooks/usePayments';
import { usePaymentFilters } from './hooks/usePaymentFilters';
import { calculateTotalAmount } from './utils/paymentHelpers';
import { StatsCards } from './StatsCards/StatsCards';
import { FiltersBar } from './FiltersBar/FiltersBar';
import PaymentsSkeleton from './PaymentsSkeleton/PaymentsSkeleton';
import { PaymentsList } from './PaymentsList/PaymentsList';
import { Pagination } from './Pagination/Pagination';
import { CourseModal } from './CourseModal/CourseModal';

export default function Payments({
	initialData,
	initialFilters,
}: IPaymentsClientProps) {
	const {
		payments,
		meta,
		loading,
		selectedPayment,
		showCourseModal,
		updatePayments,
		setLoadingState,
		openCourseModal,
		closeCourseModal,
	} = usePayments(initialData);

	const {
		filters,
		showFilters,
		hasActiveFilters,
		setShowFilters,
		updateFilters,
		fetchPage,
		clearFilters,
	} = usePaymentFilters(initialFilters);

	const totalAmount = calculateTotalAmount(payments);

	const handlePageChange = async (page: number) => {
		setLoadingState(true);
		const data = await fetchPage(page);
		updatePayments(data.data, data.meta);
		setLoadingState(false);
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="mb-8">
					<h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						Payment Dashboard
					</h1>
					<p className="text-gray-600 mt-2">
						Manage and track all transactions
					</p>
				</div>

				<StatsCards
					totalTransactions={meta.totalItems}
					totalAmount={totalAmount}
					currentPage={meta.page}
					totalPages={meta.totalPages}
				/>

				<FiltersBar
					filters={filters}
					showFilters={showFilters}
					hasActiveFilters={hasActiveFilters}
					onToggleFilters={() => setShowFilters(!showFilters)}
					onUpdateFilters={updateFilters}
					onClearFilters={clearFilters}
				/>

				{loading ? (
					<PaymentsSkeleton />
				) : (
					<PaymentsList payments={payments} onViewDetails={openCourseModal} />
				)}

				<Pagination
					currentPage={meta.page}
					totalPages={meta.totalPages}
					hasNextPage={meta.hasNextPage}
					hasPreviousPage={meta.hasPreviousPage}
					onPageChange={handlePageChange}
				/>
			</div>

			{showCourseModal && selectedPayment && (
				<CourseModal payment={selectedPayment} onClose={closeCourseModal} />
			)}
		</div>
	);
}

import { IPaymentsPageProps } from '@/src/components/Dashboard/Student/Payments/interface';
import { Suspense } from 'react';
import { fetchPayments } from '@/src/lib/serverHelper';
import PaymentsSkeleton from '@/src/components/Dashboard/Student/Payments/PaymentsSkeleton/PaymentsSkeleton';
import Payment from '@/src/components/Dashboard/Student/Payments/Payment';

export default async function PaymentsViewPage({
	searchParams,
}: IPaymentsPageProps) {
	const data = await fetchPayments(searchParams);

	return (
		<Suspense fallback={<PaymentsSkeleton />}>
			<Payment
				initialData={data}
				initialFilters={{
					type: (await searchParams).type || '',
					sortBy: (await searchParams).sortBy || 'createdAt',
					page: parseInt((await searchParams).page || '1'),
					limit: parseInt((await searchParams).limit || '50'),
				}}
			/>
		</Suspense>
	);
}

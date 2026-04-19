import { EmptyState } from '@/src/components/common/EmptyState/EmptyState';

export default async function PaymentsPage() {
	return (
		<EmptyState
			title="PAYMENTS"
			action={{
				label: 'Dashboard',
				variant: 'primary',
			}}
			description="Nothing to see here!"
		/>
	);
}

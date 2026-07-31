import VendorsManagement from '@/src/components/Dashboard/Admin/VendorsManagement/VendorsManagement';
import { getInitialVendors } from '@/src/lib/serverHelper';

export default async function VendorsManagementPage() {
	const initialData = await getInitialVendors();

	return (
		<VendorsManagement
			initialVendors={initialData.data}
			initialMeta={initialData.meta}
		/>
	);
}

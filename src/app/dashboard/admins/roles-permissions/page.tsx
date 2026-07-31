import { ISearchParams } from '@/src/components/Dashboard/Admin/RolesPermissions/interface';
import RolesPermissions from '@/src/components/Dashboard/Admin/RolesPermissions/RolesPermissions';
import { validateSearchParams } from '@/src/components/Dashboard/Admin/RolesPermissions/utils/helpers';
import { getGroupedPermissions, getRoles } from '@/src/lib/serverHelper';

const RolesPermissionsPage = async ({
	searchParams,
}: {
	searchParams: Promise<ISearchParams>;
}) => {
	const rawParams = await searchParams;
	const { page, limit, search, includePermissions } =
		validateSearchParams(rawParams);
	const roleResult = await getRoles({
		includePermissions,
		limit,
		page,
		search,
	});
	const groupedResult = await getGroupedPermissions();
	return (
		<RolesPermissions
			groupedPermissions={groupedResult.data}
			initialMeta={roleResult.meta}
			initialRoles={roleResult.data}
		/>
	);
};

export default RolesPermissionsPage;

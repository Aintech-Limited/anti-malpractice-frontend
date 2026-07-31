import { ISearchParams, IValidatedParams } from '../interface';

export async function createRole(data: {
	name: string;
	description: string;
	permissionIds: string[];
}) {
	const response = await fetch('/api/v1/roles', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	const result = await response.json();

	return result;
}

export async function updateRole(
	id: string,
	data: {
		name: string;
		description: string;
		permissionIds: string[];
	},
) {
	const response = await fetch(`/api/v1/roles`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ ...data, id }),
	});

	const result = await response.json();
	return result;
}

export async function deleteRole(id: string) {
	const response = await fetch(`/api/v1/roles/${id}`, {
		method: 'DELETE',
	});

	const result = await response.json();

	return result;
}

export async function getRoles(params: {
	page?: number;
	limit?: number;
	includePermissions?: boolean;
	search?: string;
}) {
	const searchParams = new URLSearchParams();
	if (params.page) searchParams.set('page', String(params.page));
	if (params.limit) searchParams.set('limit', String(params.limit));
	if (params.includePermissions) searchParams.set('includePermissions', 'true');
	if (params.search) searchParams.set('search', params.search);

	const response = await fetch(`/api/v1/roles?${searchParams.toString()}`);

	return response.json();
}

export const validateSearchParams = (
	params: ISearchParams,
): IValidatedParams => {
	let page = 1;
	if (params.page) {
		const parsed = parseInt(params.page, 10);
		if (!isNaN(parsed) && parsed > 0) {
			page = parsed;
		}
	}

	let limit = 50;
	if (params.limit) {
		const parsed = parseInt(params.limit, 10);
		if (!isNaN(parsed) && parsed > 0 && parsed <= 100) {
			limit = parsed;
		}
	}

	let search: string | undefined = undefined;
	if (params.search) {
		const trimmed = params.search.trim();
		if (trimmed.length > 0) {
			search = trimmed;
		}
	}

	const includePermissions = params.includePermissions === 'true';

	return {
		page,
		limit,
		search,
		includePermissions,
	};
};

'use client';

import { IMeta, IRole, IRolesPageClientProps } from './interface';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus, Check, X, AlertCircle } from 'lucide-react';
import { DeleteRoleModal } from './DeleteRoleModal/DeleteRoleModal';
import { CreateEditDialog } from './CreateEditDialog/CreateEditDialog';
import { RolesTable } from './RolesTable/RolesTable';
import { RolesPagination } from './RolesPagination/Pagination';

export default function RolesPageClient({
	initialRoles,
	initialMeta,
	groupedPermissions,
}: IRolesPageClientProps) {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [roles, setRoles] = useState<IRole[]>(initialRoles);
	const [meta, setMeta] = useState<IMeta>(initialMeta);
	const [searchTerm, setSearchTerm] = useState(
		searchParams.get('search') || '',
	);
	const [currentPage, setCurrentPage] = useState(meta.page);
	const [isLoading, setIsLoading] = useState(false);

	// Dialog states
	const [showDialog, setShowDialog] = useState(false);
	const [editingRole, setEditingRole] = useState<IRole | null>(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<IRole | null>(null);

	// Form states
	const [formName, setFormName] = useState('');
	const [formDescription, setFormDescription] = useState('');
	const [selectedPermissions, setSelectedPermissions] = useState<Set<string>>(
		new Set(),
	);
	const [expandedModules, setExpandedModules] = useState<Set<string>>(
		new Set(),
	);
	const [formErrors, setFormErrors] = useState<Record<string, string>>({});
	const [error, setError] = useState<{ network: string }>({ network: '' });
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [notification, setNotification] = useState<{
		type: 'success' | 'error';
		message: string;
	} | null>(null);

	const fetchRoles = useCallback(async (page: number, search: string) => {
		setIsLoading(true);
		try {
			const queryParams = new URLSearchParams();
			queryParams.set('page', String(page));
			queryParams.set('limit', '10');
			queryParams.set('includePermissions', 'true');
			if (search) queryParams.set('search', search);

			const response = await fetch(`/api/v1/roles?${queryParams.toString()}`);
			const data = await response.json();

			if (data.success) {
				setRoles(data.data);
				setMeta(data.meta);
			} else {
				throw new Error(data.message || 'Failed to fetch roles');
			}
		} catch (error: any) {
			showNotification('error', error.message || 'Failed to fetch roles');
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		if (
			searchTerm !== searchParams.get('search') ||
			currentPage !== meta.page
		) {
			fetchRoles(currentPage, searchTerm);
		}
	}, [currentPage, searchTerm, fetchRoles, searchParams, meta.page]);

	const showNotification = (type: 'success' | 'error', message: string) => {
		setNotification({ type, message });
		setTimeout(() => setNotification(null), 3000);
	};

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		setCurrentPage(1);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const openCreateDialog = () => {
		setEditingRole(null);
		setFormName('');
		setFormDescription('');
		setSelectedPermissions(new Set());
		setExpandedModules(new Set());
		setFormErrors({});
		setShowDialog(true);
	};

	const openEditDialog = (role: IRole) => {
		setEditingRole(role);
		setFormName(role.name);
		setFormDescription(role.description);
		setSelectedPermissions(
			new Set(role.rolePermissions?.map((rp) => rp.permission.id) || []),
		);
		setExpandedModules(new Set());
		setFormErrors({});
		setShowDialog(true);
	};

	const validateForm = () => {
		const errors: Record<string, string> = {};
		if (!formName.trim()) errors.name = 'Role name is required';
		if (!formDescription.trim()) errors.description = 'Description is required';
		if (selectedPermissions.size === 0)
			errors.permissions = 'At least one permission must be selected';
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setIsSubmitting(true);
		try {
			const payload = {
				name: formName.trim(),
				description: formDescription.trim(),
				permissionIds: Array.from(selectedPermissions),
			};

			const url = editingRole
				? `/api/v1/roles/${editingRole.id}`
				: '/api/v1/roles';

			const method = editingRole ? 'PATCH' : 'POST';

			const response = await fetch(url, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (data.success) {
				showNotification(
					'success',
					editingRole
						? 'Role updated successfully'
						: 'Role created successfully',
				);
				setShowDialog(false);
				fetchRoles(currentPage, searchTerm);
			} else {
				throw new Error(data.message || 'Operation failed');
			}
		} catch (error: any) {
			showNotification('error', error.message || 'Operation failed');
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleDelete = async () => {
		setError(() => ({ network: '' }));
		if (!deleteTarget) return;

		try {
			const response = await fetch(`/api/v1/roles/${deleteTarget.id}`, {
				method: 'DELETE',
			});

			const data = await response.json();

			if (data.success) {
				showNotification('success', 'Role deleted successfully');
				setShowDeleteConfirm(false);
				setDeleteTarget(null);
				fetchRoles(currentPage, searchTerm);
			} else {
				if (response.status === 409) {
					setError(() => ({ network: data.message }));
					throw new Error(data.message || 'Failed to delete role');
				}
				setError(() => ({ network: 'Failed to delete role' }));
				throw new Error(data.message || 'Failed to delete role');
			}
		} catch (error: any) {
			showNotification('error', error.message || 'Failed to delete role');
		}
	};

	const toggleModule = (module: string) => {
		const newExpanded = new Set(expandedModules);
		if (newExpanded.has(module)) {
			newExpanded.delete(module);
		} else {
			newExpanded.add(module);
		}
		setExpandedModules(newExpanded);
	};

	const togglePermission = (permissionId: string) => {
		const newSelected = new Set(selectedPermissions);
		if (newSelected.has(permissionId)) {
			newSelected.delete(permissionId);
		} else {
			newSelected.add(permissionId);
		}
		setSelectedPermissions(newSelected);
	};

	const toggleAllModulePermissions = (module: string) => {
		const modulePermissions = groupedPermissions[module] || [];
		const newSelected = new Set(selectedPermissions);
		const allSelected = modulePermissions.every((p) => newSelected.has(p.id));

		if (allSelected) {
			modulePermissions.forEach((p) => newSelected.delete(p.id));
		} else {
			modulePermissions.forEach((p) => newSelected.add(p.id));
		}

		setSelectedPermissions(newSelected);
	};

	const getPermissionCountByModule = (role: IRole) => {
		const counts: Record<string, number> = {};
		role.rolePermissions?.forEach((rp) => {
			const moduleI = rp.permission.module;
			counts[moduleI] = (counts[moduleI] || 0) + 1;
		});
		return counts;
	};

	return (
		<div className="space-y-6">
			{notification && (
				<div
					className={`fixed top-4 right-4 z-11 p-4 rounded-lg shadow-lg ${
						notification.type === 'success'
							? 'bg-green-50 border border-green-200 text-green-800'
							: 'bg-red-50 border border-red-200 text-red-800'
					}`}
				>
					<div className="flex items-center gap-2">
						{notification.type === 'success' ? (
							<Check className="h-5 w-5 text-green-500" />
						) : (
							<AlertCircle className="h-5 w-5 text-red-500" />
						)}
						<span className="font-medium">{notification.message}</span>
						<button
							onClick={() => setNotification(null)}
							className="ml-4 hover:opacity-70"
						>
							<X className="h-4 w-4" />
						</button>
					</div>
				</div>
			)}

			<div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
				<div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
					<div className="relative flex-1 max-w-md">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
						<input
							type="text"
							placeholder="Search roles..."
							value={searchTerm}
							onChange={(e) => handleSearch(e.target.value)}
							className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all"
						/>
					</div>
					<button
						onClick={openCreateDialog}
						className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all"
					>
						<Plus className="h-4 w-4" />
						Add Role
					</button>
				</div>
			</div>

			<RolesTable
				getPermissionCountByModule={getPermissionCountByModule}
				isLoading={isLoading}
				openEditDialog={openEditDialog}
				roles={roles}
				searchTerm={searchTerm}
				setDeleteTarget={setDeleteTarget}
				setShowDeleteConfirm={setShowDeleteConfirm}
			/>

			{meta.totalPages > 1 && (
				<RolesPagination
					currentPage={currentPage}
					handlePageChange={handlePageChange}
					meta={meta}
				/>
			)}

			{showDialog && (
				<CreateEditDialog
					editingRole={editingRole}
					expandedModules={expandedModules}
					formDescription={formDescription}
					formErrors={formErrors}
					formName={formName}
					groupedPermissions={groupedPermissions}
					handleSubmit={handleSubmit}
					isSubmitting={isSubmitting}
					selectedPermissions={selectedPermissions}
					setFormDescription={setFormDescription}
					setFormName={setFormName}
					setShowDialog={setShowDialog}
					toggleAllModulePermissions={toggleAllModulePermissions}
					toggleModule={toggleModule}
					togglePermission={togglePermission}
				/>
			)}

			{showDeleteConfirm && (
				<DeleteRoleModal
					deleteTarget={deleteTarget}
					error={error}
					handleDelete={handleDelete}
					setShowDeleteConfirm={setShowDeleteConfirm}
				/>
			)}
		</div>
	);
}

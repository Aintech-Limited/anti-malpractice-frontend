'use client';

import { useEffect, useState } from 'react';
import { ICreateUpdateInstitutionModalProps } from './interface';
import { Country, ICountry, IState, State } from 'country-state-city';
import { toast } from 'react-toastify';

export default function CreateUpdateInstitutionModal({
	isOpen,
	initialData,
	onClose,
	onSuccess,
}: ICreateUpdateInstitutionModalProps) {
	const allCOuntries = Country.getAllCountries();

	const isEdit = !!initialData;
	const [loading, setLoading] = useState(false);
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [error, setError] = useState('');

	const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
	const [selectedState, setSelectedState] = useState<null | IState>(null);

	const [formData, setFormData] = useState({
		institutionLevel: initialData?.institutionLevel || 'TERTIARY',
		name: initialData?.name || '',
		code: initialData?.code || '',
		email: initialData?.email || '',
		status: initialData?.status || 'ACTIVE',
		location: initialData?.location || '',
		address: initialData?.address || '',
		logoUrl: initialData?.logoUrl || '',
		bannerUrl: initialData?.bannerUrl || '',
		motto: initialData?.motto || '',
		phoneNumber: initialData?.phoneNumber || '',
		websiteUrl: initialData?.websiteUrl || '',
		country: initialData?.country
			? (allCOuntries.find((c) => c.name === initialData.country)?.isoCode ??
				'')
			: '',
		state: initialData?.state ?? selectedState?.isoCode ?? '',
		city: initialData?.city || '',
		postalCode: initialData?.postalCode ?? '',
		establishedYear: initialData?.establishedYear || '',
		description: initialData?.description || '',
	});

	useEffect(() => {
		if (!formData.institutionLevel) {
			setButtonDisabled(true);
			return;
		}
		if (!formData.name) {
			setButtonDisabled(true);
			return;
		}
		if (!formData.code) {
			setButtonDisabled(true);
			return;
		}
		if (!formData.email) {
			setButtonDisabled(true);
			return;
		}
		if (!formData.status) {
			setButtonDisabled(true);
			return;
		}
		if (!formData.location) {
			setButtonDisabled(true);
			return;
		}
		if (!formData.address) {
			setButtonDisabled(true);
			return;
		}
		setButtonDisabled(false);
	}, [
		buttonDisabled,
		formData.address,
		formData.code,
		formData.email,
		formData.institutionLevel,
		formData.location,
		formData.name,
		formData.status,
	]);

	if (!isOpen) return null;

	const resetForm = () => {
		setFormData(() => ({
			address: '',
			bannerUrl: '',
			city: '',
			code: '',
			country: '',
			description: '',
			email: '',
			establishedYear: '',
			institutionLevel: 'TERTIARY',
			location: '',
			logoUrl: '',
			motto: '',
			name: '',
			phoneNumber: '',
			postalCode: '',
			state: '',
			status: 'ACTIVE',
			websiteUrl: '',
		}));
	};

	const validateURL = (url: string) => {
		try {
			const link = new URL(url);
			if (link.protocol !== 'https:') {
				throw new Error('Invalid URL');
			}
			return true;
		} catch {
			toast.error('Logo Link must be a secured URL');
			return false;
		}
	};

	const allStates = State.getStatesOfCountry(selectedCountry?.isoCode ?? '');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError('');

		if (formData.bannerUrl) {
			const isURLValid = validateURL(formData.bannerUrl);
			if (!isURLValid) return;
		}
		if (formData.logoUrl) {
			const isURLValid = validateURL(formData.logoUrl);
			if (!isURLValid) return;
		}
		if (formData.websiteUrl) {
			const isURLValid = validateURL(formData.websiteUrl);
			if (!isURLValid) return;
		}

		if (formData.establishedYear) {
			const currentYear = new Date().getFullYear();
			if (Number(formData.establishedYear) > currentYear) {
				toast.error(`Established Year must not exceed ${currentYear}`);
				return;
			}
		}

		try {
			const endpoint = isEdit
				? `/api/v1/institutions/${initialData.id}`
				: `/api/v1/institutions`;

			const method = isEdit ? 'PATCH' : 'POST';

			const payload = Object.fromEntries(
				Object.entries({
					...formData,
					...(formData.establishedYear && {
						establishedYear: Number(formData.establishedYear),
					}),
					country: initialData?.country ?? selectedCountry?.name ?? '',
					state: initialData?.state ?? selectedState?.name ?? '',
				}).filter(([_key, value]) => !!value),
			);

			const res = await fetch(endpoint, {
				method,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});

			if (res.ok) {
				setButtonDisabled(false);
				setError('');
				resetForm();
				onSuccess();
				return;
			}
			const error = await res.json();

			const message = Array.isArray(error?.message)
				? error?.message.join(', ')
				: error?.message;
			setError(message ?? `Could not ${isEdit ? 'modify' : 'add'} Institution`);
		} catch (err) {
			console.error('Error submitting form:', err);
			setError(`Could not ${isEdit ? 'modify' : 'add'} Institution`);
			setButtonDisabled(true);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 mt-10">
			<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-blue-100">
				<div className="bg-blue-600 px-6 py-4 text-white">
					<h2 className="text-lg font-bold">
						{isEdit ? 'Edit Institution' : 'Create Institution'}
					</h2>
				</div>

				{error && (
					<div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden border border-red-100 text-red-500 p-6 text-center">
						{error}
					</div>
				)}

				<form
					onSubmit={handleSubmit}
					className="p-6 max-h-[80vh] overflow-y-auto space-y-4"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Name *
							</label>
							<input
								required
								type="text"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
								minLength={3}
								maxLength={255}
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Code *
							</label>
							<input
								required
								type="text"
								value={formData.code}
								onChange={(e) =>
									setFormData({ ...formData, code: e.target.value })
								}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
								minLength={3}
								maxLength={55}
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Email *
							</label>
							<input
								required
								type="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
								maxLength={150}
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Level *
							</label>
							<select
								value={formData.institutionLevel}
								onChange={(e) =>
									setFormData({
										...formData,
										institutionLevel: e.target.value as any,
									})
								}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
								required
							>
								<option value="PRIMARY">PRIMARY</option>
								<option value="SECONDARY">SECONDARY</option>
								<option value="TERTIARY">TERTIARY</option>
							</select>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Status *
							</label>
							<select
								value={formData.status}
								onChange={(e) =>
									setFormData({ ...formData, status: e.target.value as any })
								}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
								required
							>
								<option value="ACTIVE">ACTIVE</option>
								<option value="INACTIVE">INACTIVE</option>
							</select>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Location *
							</label>
							<input
								type="text"
								value={formData.location}
								onChange={(e) =>
									setFormData({ ...formData, location: e.target.value })
								}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
								required
								minLength={3}
								maxLength={255}
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Address *
							</label>
							<input
								type="text"
								value={formData.address}
								onChange={(e) =>
									setFormData({ ...formData, address: e.target.value })
								}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
								required
								minLength={3}
								maxLength={255}
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Logo Link
							</label>
							<input
								type="text"
								value={formData.logoUrl}
								onChange={(e) => {
									setFormData({ ...formData, logoUrl: e.target.value });
								}}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Banner Link
							</label>
							<input
								type="text"
								value={formData.bannerUrl}
								onChange={(e) => {
									setFormData({ ...formData, bannerUrl: e.target.value });
								}}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Motto
							</label>
							<input
								type="text"
								value={formData.motto}
								onChange={(e) => {
									setFormData({ ...formData, motto: e.target.value });
								}}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Website URL
							</label>
							<input
								type="text"
								value={formData.websiteUrl}
								onChange={(e) => {
									setFormData({ ...formData, websiteUrl: e.target.value });
								}}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Country
							</label>
							<select
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
								onChange={(e) => {
									const foundCOuntry = allCOuntries.find(
										(c) => c.isoCode === e.target.value,
									);
									if (foundCOuntry) {
										setSelectedCountry(foundCOuntry);
									}
								}}
								// required
								name="country"
								value={selectedCountry?.isoCode ?? ''}
							>
								<option value="" disabled>
									Select Country
								</option>
								{allCOuntries.map((country) => (
									<option key={country.isoCode} value={country.isoCode}>
										{country.name}
									</option>
								))}
							</select>
						</div>

						{selectedCountry && (
							<div>
								<label className="block text-xs font-semibold text-slate-700 mb-1">
									State
								</label>
								<div className="relative">
									<select
										className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
										onChange={(e) => {
											const foundState = allStates.find(
												(c) => c.isoCode === e.target.value,
											);
											if (foundState) {
												setSelectedState(foundState);
												return;
											}
										}}
										disabled={!selectedCountry?.isoCode}
										required
										name="state"
										value={selectedState?.isoCode ?? ''}
									>
										<option value="" disabled>
											Select State
										</option>
										{allStates.map((state) => (
											<option key={state.isoCode} value={state.isoCode}>
												{state.name}
											</option>
										))}
									</select>
								</div>
							</div>
						)}

						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								City
							</label>
							<input
								type="text"
								value={formData.city}
								onChange={(e) => {
									setFormData({ ...formData, city: e.target.value });
								}}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Postal Code
							</label>
							<input
								type="number"
								value={formData.postalCode}
								onChange={(e) => {
									setFormData({ ...formData, postalCode: e.target.value });
								}}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Established Year
							</label>
							<input
								type="number"
								value={formData.establishedYear}
								onChange={(e) => {
									setFormData({ ...formData, establishedYear: e.target.value });
								}}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
						<div>
							<label className="block text-xs font-semibold text-slate-700 mb-1">
								Description
							</label>
							<textarea
								value={formData.description}
								onChange={(e) => {
									setFormData({ ...formData, description: e.target.value });
								}}
								rows={4}
								className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
							/>
						</div>
					</div>

					<div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
						<button
							type="button"
							onClick={() => {
								resetForm();
								onClose();
							}}
							className="px-4 py-2 border border-slate-300 text-slate-700 text-sm rounded-md hover:bg-slate-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading || buttonDisabled}
							className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors ${buttonDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
						>
							{loading
								? 'Saving...'
								: isEdit
									? 'Update Institution'
									: 'Create Institution'}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}

'use client';

import { useState } from 'react';
import { FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { ComplaintCategoryEnum, TComplaintCategoryEnum } from '@/src/lib/enums';

export default function ComplaintForm() {
	const [category, setCategory] = useState<TComplaintCategoryEnum>(
		ComplaintCategoryEnum.OTHERS,
	);
	const [location, setLocation] = useState('');
	const [description, setDescription] = useState('');
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const CHARACTER_LIMIT = 500;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		if (!category || !description) {
			toast.error('Please fill out all required fields.');
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch('/api/v1/complaints', {
				method: 'POST',
				body: JSON.stringify({ category, location, description }),
			});

			const data = await response.json();
			if (data.success || response.ok) {
				setIsSubmitted(true);
				return;
			}
			setIsSubmitted(false);
			toast.error(data.error || 'Error submitting Complaint');
		} catch (error) {
			setIsSubmitted(false);
			toast.error('Error submitting Complaint');
		} finally {
			setIsLoading(false);
		}
	};

	if (isSubmitted) {
		return (
			<div className="w-full max-w-2xl bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center my-6 mx-auto">
				<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 mb-4">
					<CheckCircle2 className="w-10 h-10" />
				</div>
				<h2 className="text-xl font-bold text-slate-900 mb-2">
					Complaint Submitted Successfully
				</h2>
				<p className="text-sm text-slate-500 mb-6 max-w-md mx-auto">
					Thank you for channeling your feedback. Our team will review the
					details and take appropriate action.
				</p>
				<button
					onClick={() => {
						setCategory('');
						setLocation('');
						setDescription('');
						setIsSubmitted(false);
					}}
					className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition shadow-sm shadow-blue-200"
				>
					Submit Another Complaint
				</button>
			</div>
		);
	}

	return (
		<div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-slate-100/80 overflow-hidden my-6 mx-auto">
			<div className="bg-[#E0E4FF] px-6 py-4 flex items-center gap-3">
				<div className="bg-white p-1.5 rounded-lg text-blue-600 shadow-xs">
					<FileText className="w-5 h-5" />
				</div>
				<span className="text-[#001489] font-semibold text-sm tracking-wide">
					Channel your Complaints here
				</span>
			</div>

			<form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
				<div>
					<label className="block text-sm font-bold text-slate-900 mb-2 tracking-tight">
						Category of Complaint <span className="text-slate-900">*</span>
					</label>
					<div className="relative">
						<select
							value={category}
							onChange={(e) => setCategory(e.target.value)}
							required
							className="w-full px-4 py-3 bg-[#F4F4F6] text-slate-700 rounded-xl border border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all text-sm appearance-none cursor-pointer"
						>
							<option value="" disabled hidden>
								Select Complaint Category
							</option>
							<option value={ComplaintCategoryEnum.INFRASTRUCTURE}>
								Infrastructure Breakdown
							</option>
							<option value={ComplaintCategoryEnum.UTILITY}>
								Utility Failure (Water/Power)
							</option>
							<option value={ComplaintCategoryEnum.SANITATION}>
								Sanitation & Waste
							</option>
							<option value={ComplaintCategoryEnum.SECURITY}>
								Safety & Security Concern
							</option>
							<option value={ComplaintCategoryEnum.SEXUAL_ASSULT}>
								Sexual Assualt
							</option>
							<option value={ComplaintCategoryEnum.OTHERS}>Others</option>
						</select>
						<div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400">
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 9l-7 7-7-7"
								/>
							</svg>
						</div>
					</div>
				</div>

				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2 tracking-tight">
						<span className="w-4 h-4 bg-[#FF6600] rounded-full inline-block"></span>
						Location (Optional)
					</label>
					<input
						type="text"
						placeholder="e.g., Lagos, Port Harcourt, Bayelsa, GRA, Diobu, Ibadan..."
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						className="w-full px-4 py-3 bg-white rounded-xl border border-slate-200 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 focus:outline-none transition-all text-sm shadow-inner"
					/>
				</div>

				<div>
					<label className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-2 tracking-tight">
						<span className="w-4 h-4 bg-[#0011FF] rounded-md inline-block"></span>
						Describe Your Complaint *
					</label>
					<div className="relative">
						<textarea
							rows={5}
							maxLength={CHARACTER_LIMIT}
							placeholder="Please provide detailed information about the challenge you're facing. Include specifics like when occurd, how it affects you or the community..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
							className="w-full px-4 py-3 bg-white rounded-2xl border-2 border-slate-300 placeholder-slate-400 focus:border-blue-600 focus:outline-none transition-all text-sm leading-relaxed"
						/>
					</div>

					<div className="flex justify-end mt-2">
						<span className="bg-[#FFE5E5] text-[#FF3B3B] text-xs font-bold px-3 py-1 rounded-full border border-rose-100">
							{description.length}/{CHARACTER_LIMIT} characters
						</span>
					</div>
				</div>

				<div className="pt-4">
					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3.5 bg-[#0000FF] hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition shadow-md shadow-blue-600/10 flex items-center justify-center gap-2 tracking-wide cursor-pointer"
					>
						<CheckCircle2 className="w-4 h-4" />{' '}
						{isLoading ? 'Submitting...' : 'Submit Complaints'}
					</button>
				</div>

				<p className="text-center text-xs font-medium text-slate-400 pt-4 tracking-tight">
					For emergency situations, immediately contact local authrotities or
					dial <span className="font-semibold text-slate-600">200</span>
				</p>
			</form>
		</div>
	);
}

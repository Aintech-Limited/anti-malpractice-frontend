'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { studentReadingImage } from '@/public/assetLinks';
import Image from 'next/image';
import { toast } from 'react-toastify';

const ContactAndNewsletter = () => {
	const [email, setEmail] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setEmail(e.target.value);
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!email.trim()) return;

		setIsSubmitting(true);

		try {
			const res = await fetch('/api/v1/newsletter', {
				method: 'POST',
				body: JSON.stringify({
					email,
				}),
			});

			if (res.status === 201) {
				toast.success('Newsletter subscription successful.');
				setEmail('');
			}
			if (res.status > 201)
				toast.error(
					'Could not add you to newsletter subscription. Please try again later',
				);
		} catch (error) {
			console.error('Newsletter subscription failed:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20 font-sans overflow-hidden">
			<div className="bg-blue-600 rounded-4xl sm:rounded-[40px] p-6 sm:p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 mb-16 sm:mb-24">
				<div className="flex-1 min-w-0 text-white w-full">
					<h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-5 sm:mb-6 leading-tight">
						Ready to make a change for the future?
					</h2>

					<p className="text-base sm:text-lg opacity-90 mb-7 sm:mb-8 max-w-md leading-relaxed">
						Fill the form to make enquiries or request a demo. A representative
						will respond promptly.
					</p>

					<button
						type="button"
						className="bg-[#00008B] hover:bg-black text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl font-semibold transition-all"
					>
						Contact Us
					</button>
				</div>

				<div className="flex-1 w-full max-w-md min-w-0">
					<Image
						src={studentReadingImage}
						alt="Student working on tablet"
						width={100}
						height={150}
						className="rounded-3xl w-full h-72 sm:h-80 md:h-100 object-cover shadow-2xl"
					/>
				</div>
			</div>

			<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 border-t border-gray-100 pt-10 sm:pt-12">
				<div className="text-left w-full md:w-auto min-w-0">
					<h3 className="text-xl font-bold text-gray-900 mb-2">
						Join our newsletter
					</h3>

					<p className="text-gray-500 text-sm sm:text-base">
						We&apos;ll send you a nice letter once per week. No spam.
					</p>
				</div>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col sm:flex-row w-full md:w-auto gap-3 min-w-0"
				>
					<input
						type="email"
						name="email"
						value={email}
						onChange={handleInputChange}
						placeholder="Enter your email"
						required
						className="w-full sm:w-64 md:w-80 min-w-0 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
					/>

					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-xl font-semibold transition-colors whitespace-nowrap"
					>
						{isSubmitting ? 'Subscribing...' : 'Subscribe'}
					</button>
				</form>
			</div>
		</section>
	);
};

export default ContactAndNewsletter;

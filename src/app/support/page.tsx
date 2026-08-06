import { Suspense } from 'react';
// import { fetchSupportArticles } from "@/src/lib/serverHelper";
import Support from '@/src/components/Support/Support';
import { SupportSkeleton } from '@/src/components/Support/SupportSkeleton/SupportSkeleton';
export const dynamic = 'force-dynamic';

const SupportPage = async () => {
	// const { data } = await fetchSupportArticles();

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold text-gray-900 mb-4">
						How can we help you?
					</h1>
					<p className="text-xl text-gray-600 max-w-2xl mx-auto">
						Browse our articles or submit a support ticket. We&apos;re here to
						help you 24/7.
					</p>
				</div>

				<Suspense fallback={<SupportSkeleton />}>
					<Support
						initialArticles={[]}
						initialCategories={[]}
						// initialArticles={data.articles}
						// initialCategories={data.categories}
					/>
				</Suspense>
			</div>
		</div>
	);
};

export default SupportPage;

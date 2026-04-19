import { aintechLogo } from '@/public/assetLinks';
import { APP_NAME } from '@/src/lib/data';
import { cookies } from 'next/headers';
import Image from 'next/image';

const FooterSection = async () => {
	const currentYear = new Date().getFullYear();
	const cookie = await cookies();
	const token = cookie.get(process.env.AUTH_TOKEN_NAME)?.name;

	return (
		<footer className="w-full bg-[#f4f7ff] pt-20 pb-10 font-sans">
			<div className="max-w-7xl mx-auto px-6">
				<div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
					<div className="lg:col-span-2">
						<div className="flex items-center gap-2 mb-6">
							<Image
								src={aintechLogo}
								alt={`${APP_NAME} Logo`}
								width={50}
								height={80}
							/>
							<span className="text-xl font-bold text-[#4B618C] tracking-wider uppercase">
								{APP_NAME}
							</span>
						</div>
						<h4 className="text-2xl font-bold text-gray-800 mb-6">
							Let&apos;s get started on
							<br />
							something great
						</h4>
						{!token && (
							<button className="flex items-center gap-3 bg-white border border-gray-300 px-6 py-3 rounded-xl hover:shadow-md transition-shadow">
								<svg width="20" height="20" viewBox="0 0 24 24">
									<path
										d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
										fill="#4285F4"
									/>
									<path
										d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.01.68-2.33 1.09-3.71 1.09-2.85 0-5.27-1.92-6.13-4.51H2.18v2.84C3.99 20.53 7.7 23 12 23z"
										fill="#34A853"
									/>
									<path
										d="M5.87 14.15c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.13H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.87l3.69-2.72z"
										fill="#FBBC05"
									/>
									<path
										d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.13l3.69 2.84c.86-2.59 3.28-4.51 6.13-4.51z"
										fill="#EA4335"
									/>
								</svg>
								<span className="font-semibold text-gray-700">
									Sign in with Google
								</span>
							</button>
						)}
					</div>

					{/* Links Columns */}
					<div className="grid grid-cols-2 lg:grid-cols-3 gap-8 lg:col-span-2">
						<div>
							<p className="text-[#8E9FBC] font-bold mb-6">Product</p>
							<ul className="space-y-4 text-[#334155] font-semibold">
								<li>
									<a href="#" className="hover:text-blue-600 transition-colors">
										Overview
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-600 transition-colors">
										Features
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-600 transition-colors">
										Pricing
									</a>
								</li>
							</ul>
						</div>
						<div>
							<p className="text-[#8E9FBC] font-bold mb-6">Company</p>
							<ul className="space-y-4 text-[#334155] font-semibold">
								<li>
									<a href="#" className="hover:text-blue-600 transition-colors">
										About us
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-600 transition-colors">
										Careers
									</a>
								</li>
							</ul>
						</div>
						<div>
							<p className="text-[#8E9FBC] font-bold mb-6">Legal</p>
							<ul className="space-y-4 text-[#334155] font-semibold">
								<li>
									<a href="#" className="hover:text-blue-600 transition-colors">
										Terms
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-600 transition-colors">
										Privacy
									</a>
								</li>
								<li>
									<a href="#" className="hover:text-blue-600 transition-colors">
										Contact
									</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="pt-8 border-t border-gray-200">
					<p className="text-sm text-gray-500">
						Copyright © {currentYear}. {APP_NAME}. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default FooterSection;

import { heroImage } from '@/public/assetLinks';
import Image from 'next/image';

const HeroSection = () => {
	return (
		<section className="flex items-center justify-center bg-blue-200 p-4 md:p-8 overflow-hidden">
			<div className="max-w-7xl flex flex-col md:flex-row items-center">
				{/* Text Content */}
				<div className="flex-1 p-8 md:p-16 flex flex-col justify-center order-1">
					<h1 className="animate-fade-up text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
						Sell your eBooks{' '}
						<span className="text-blue-600 animate-hero-text">Seamlessly</span>{' '}
						and create secure exams with{' '}
						<span className="animate-hero-text">confidence</span>
					</h1>

					<div className="animate-fade-up opacity-0 delay-1 space-y-4 text-gray-700 text-lg leading-relaxed mb-10">
						<p>
							Design timed tests, auto-graded quizzes, and proctored exams in a
							protected browser environment.
						</p>
						<p>
							Also, reach your students directly with built-in payments,
							downloads, and copyright protection.
						</p>
					</div>

					<a href="/signup">
						<button className="animate-fade-up opacity-0 delay-2 w-fit px-10 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all duration-300 text-lg shadow-lg hover:shadow-blue-300/50">
							Get Started
						</button>
					</a>
				</div>

				{/* Image Content */}
				<div className="flex-1 p-8 md:p-6 order-2 relative">
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-400 rounded-full blur-[100px] opacity-20 animate-pulse"></div>

					<div className="relative animate-float">
						<Image
							src={heroImage}
							alt={'hero Image'}
							className="object-cover rounded-3xl shadow-2xl border-4 border-white/30"
							priority
							width={500}
							height={600}
						/>

						<div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl animate-float delay-1 hidden md:block">
							<div className="flex items-center gap-3">
								<div className="w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
								<p className="text-sm font-bold text-gray-800">
									100% Secure Exams
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default HeroSection;

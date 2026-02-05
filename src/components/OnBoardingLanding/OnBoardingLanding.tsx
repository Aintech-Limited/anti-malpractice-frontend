'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { bookData } from './data';

const AUTO_DELAY = 4000;

export default function OnBoardingLanding() {
	const [index, setIndex] = useState(0);
	const [direction, setDirection] = useState<'left' | 'right'>('right');
	const [paused, setPaused] = useState(false);

	const timeoutRef = useRef<NodeJS.Timeout | null>(null);
	const goNext = () => {
		setDirection('right');
		setIndex((prev) => (prev + 1) % total);
	};

	const total = bookData.length;

	const goPrev = () => {
		setDirection('left');
		setIndex((prev) => (prev - 1 + total) % total);
	};

	useEffect(() => {
		const goNext = () => {
			setDirection('right');
			setIndex((prev) => (prev + 1) % total);
		};
		if (paused) return;

		timeoutRef.current = setTimeout(goNext, AUTO_DELAY);

		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [index, paused, total]);

	return (
		<div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-white overflow-hidden">
			<div className="w-full max-w-7xl px-6">
				{/* Slide */}
				<div className="relative h-125 overflow-hidden">
					<div
						key={index}
						className={`absolute inset-0 flex flex-col items-center justify-center transition-transform duration-500 ease-out
              ${
								direction === 'right'
									? 'animate-slide-in-right'
									: 'animate-slide-in-left'
							}
            `}
					>
						<div className="w-full max-w-4xl h-87.5 rounded-2xl overflow-hidden shadow-2xl mb-8">
							<Image
								src={bookData[index].imageUrl}
								alt={bookData[index].title}
								sizes="(max-width: 1024px) 40vw, 1024px"
								className="object-cover"
								priority
								width={1000}
								height={400}
							/>
						</div>

						<div className="text-center max-w-2xl">
							<h2 className="text-4xl font-bold text-slate-900 mb-4">
								{bookData[index].title}
							</h2>
							<p className="text-lg text-slate-600">
								{bookData[index].description}
							</p>
						</div>
					</div>
				</div>

				{/* Controls */}
				<div className="mt-10 flex items-center justify-between">
					<div className="flex gap-4">
						<button
							onClick={() => {
								setPaused(true);
								goPrev();
							}}
							className="p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800"
						>
							<ChevronLeft size={24} />
						</button>

						<button
							onClick={() => {
								setPaused(true);
								goNext();
							}}
							className="p-3 rounded-full bg-slate-900 text-white hover:bg-slate-800"
						>
							<ChevronRight size={24} />
						</button>
					</div>

					<Link
						href="/signup"
						className="text-xl font-bold text-slate-800 hover:text-blue-600 transition"
					>
						Get Started
					</Link>
				</div>
			</div>

			{/* Animations */}
			<style jsx global>{`
				@keyframes slideInRight {
					from {
						transform: translateX(100%);
					}
					to {
						transform: translateX(0);
					}
				}

				@keyframes slideInLeft {
					from {
						transform: translateX(-100%);
					}
					to {
						transform: translateX(0);
					}
				}

				.animate-slide-in-right {
					animation: slideInRight 0.5s ease-out;
				}

				.animate-slide-in-left {
					animation: slideInLeft 0.5s ease-out;
				}
			`}</style>
		</div>
	);
}

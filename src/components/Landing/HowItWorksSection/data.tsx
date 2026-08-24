import { IUserRole } from './interface';

export const ROLES: IUserRole[] = [
	{
		id: 'lecturer',
		title: 'Lecturers & Educators',
		badge: 'Creator Mode',
		tagline: 'Monetize your academic expertise and build your digital brand.',
		description:
			'Lecturers and educators are increasingly adopting the role of digital content creators and online entrepreneurs, utilizing technology to monetize their expertise through eBooks and online assessment tools.',
		benefits: [
			'Publish and distribute eBooks seamlessly',
			'Create and manage online assessments',
			'Monetize course materials directly',
			'Track student engagement & performance',
		],
		icon: (
			<svg
				className="w-6 h-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 14l9-5-9-5-9 5 9 5z"
				/>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
				/>
			</svg>
		),
	},
	{
		id: 'student',
		title: 'Students & Learners',
		badge: 'Learner Mode',
		tagline: 'Carry your entire library in your pocket—anytime, anywhere.',
		description:
			'An eBook is easy to carry around. Instead of carrying a bag full of books, it is easier to carry a mobile device that supports eBooks. Most students these days always carry a mobile-based device—a smartphone, a tablet, or a laptop. The portability of an eBook allows students to refer to their notes and course materials anytime they want.',
		benefits: [
			'All course materials in one place',
			'Accessible on smartphone, tablet, or laptop',
			'Study on-the-go with portable notes',
			'Interactive tools for smarter learning',
		],
		icon: (
			<svg
				className="w-6 h-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth={2}
					d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
				/>
			</svg>
		),
	},
];

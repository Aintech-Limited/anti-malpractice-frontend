'use client';

import Image from 'next/image';
import {
	Mail,
	CheckCircle,
	XCircle,
	Fingerprint,
	Calendar,
	User,
	BookOpen,
} from 'lucide-react';
import { ICourseStudent } from '../interface';

export default function StudentCard({ student }: { student: ICourseStudent }) {
	const getFullName = () => {
		return `${student.firstName} ${student.lastName}`;
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
		});
	};

	return (
		<div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
			<div className="w-full md:w-32 h-32 shrink-0">
				{student.imageUrl ? (
					<Image
						src={student.imageUrl}
						alt={getFullName()}
						className="w-full h-full object-cover rounded-xl shadow-inner"
						width={128}
						height={128}
					/>
				) : (
					<div className="w-full h-full bg-linear-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
						<span className="text-3xl font-bold text-blue-400">
							{student.firstName[0]}
							{student.lastName[0]}
						</span>
					</div>
				)}
			</div>

			{/* Content */}
			<div className="flex-1 space-y-3">
				<div>
					<h2 className="text-xl font-bold text-gray-900">{getFullName()}</h2>
					<div className="flex gap-2 mt-2 flex-wrap">
						{student.emailVerified && (
							<span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1">
								<CheckCircle size={12} />
								Email Verified
							</span>
						)}
						{student.faceAuthEnabled && (
							<span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold flex items-center gap-1">
								<Fingerprint size={12} />
								Face Auth Enabled
							</span>
						)}
						{student.isBlocked ? (
							<span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold flex items-center gap-1">
								<XCircle size={12} />
								Blocked
							</span>
						) : (
							<span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold flex items-center gap-1">
								<CheckCircle size={12} />
								Active
							</span>
						)}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
					<div className="flex items-center gap-2 text-gray-600">
						<Mail size={16} className="text-gray-400" />
						<span>{student.email}</span>
					</div>

					{student.matricNumber && (
						<div className="flex items-center gap-2 text-gray-600">
							<User size={16} className="text-gray-400" />
							<span>Matric: {student.matricNumber}</span>
						</div>
					)}

					{student.department && (
						<div className="flex items-center gap-2 text-gray-600">
							<BookOpen size={16} className="text-gray-400" />
							<span>{student.department}</span>
						</div>
					)}

					{student.level && (
						<div className="flex items-center gap-2 text-gray-600">
							<Calendar size={16} className="text-gray-400" />
							<span>Level {student.level}</span>
						</div>
					)}
				</div>

				<div className="text-xs text-gray-400 flex items-center gap-1">
					<Calendar size={12} />
					<span>Enrolled: {formatDate(student.enrollmentDate)}</span>
				</div>
			</div>
		</div>
	);
}

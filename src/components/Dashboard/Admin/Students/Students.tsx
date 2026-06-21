'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { IStudent, TActionType } from './interface';
import { ModalWrapper } from './modals/wrapper';
import { StudentNavigation } from './Navigation/Navigation';
import { StudentTable } from './StudentTable/StudentTable';

export default function Students({
	initialStudents,
}: {
	initialStudents: IStudent[];
}) {
	const [students, setStudents] = useState<IStudent[]>(initialStudents);
	const [searchQuery, setSearchQuery] = useState('');
	const [activeDropdownId, setActiveDropdownId] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [modalState, setModalState] = useState<{
		type: TActionType;
		student: IStudent | null;
	}>({
		type: null,
		student: null,
	});

	const itemsPerPage = 5;

	const filteredStudents = useMemo(() => {
		return students.filter((student) => {
			return (
				student?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
				student.studentId.toLowerCase().includes(searchQuery.toLowerCase())
			);
		});
	}, [students, searchQuery]);

	const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
	const paginatedStudents = useMemo(() => {
		const startIndex = (currentPage - 1) * itemsPerPage;
		return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
	}, [filteredStudents, currentPage]);

	const handleAction = (type: TActionType, student: IStudent) => {
		setModalState({ type, student });
		setActiveDropdownId(null);
	};

	return (
		<div className="min-h-screen bg-slate-50 p-6 md:p-12 flex justify-center text-slate-800">
			<div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm p-6 border border-slate-100 flex flex-col justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight mb-4">Students</h1>
					<div className="relative mb-8 w-full max-w-xl">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search for students or ID"
							value={searchQuery}
							onChange={(e) => {
								setSearchQuery(e.target.value);
								setCurrentPage(1);
							}}
							className="w-full pl-12 pr-4 py-3 bg-white rounded-full border border-slate-200 shadow-inner text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
						/>
					</div>

					<div className="overflow-visible">
						<div className="grid grid-cols-12 gap-4 pb-4 border-b border-slate-100 text-sm font-bold text-slate-900 px-2 mb-2">
							<div className="col-span-2">Photo</div>
							<div className="col-span-4">Name</div>
							<div className="col-span-2">Student ID</div>
							<div className="col-span-2 text-center sm:text-left">Year</div>
							<div className="col-span-2 text-right pr-4">Action</div>
						</div>

						<div className="space-y-1">
							{paginatedStudents.length > 0 ? (
								paginatedStudents.map((student) => (
									<StudentTable
										activeDropdownId={activeDropdownId}
										onAction={handleAction}
										onSetActiveDropdownId={setActiveDropdownId}
										student={student}
										key={student.id}
									/>
								))
							) : (
								<div className="text-center py-12 text-slate-400 text-sm font-medium">
									No match found for student criteria.
								</div>
							)}
						</div>
					</div>
				</div>

				{totalPages > 1 && (
					<StudentNavigation
						currentPage={currentPage}
						filteredStudents={filteredStudents}
						itemsPerPage={itemsPerPage}
						onSetCurrentPage={setCurrentPage}
						totalPages={totalPages}
					/>
				)}
			</div>

			{modalState.type && modalState.student && (
				<ModalWrapper modalState={modalState} onSetModalState={setModalState} />
			)}
		</div>
	);
}

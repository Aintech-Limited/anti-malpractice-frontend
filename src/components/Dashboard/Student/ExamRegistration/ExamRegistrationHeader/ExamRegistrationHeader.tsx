export const ExamRegistrationHeader = ({
	totalExams,
}: {
	totalExams: number;
}) => {
	return (
		<header className="mb-8">
			<h1 className="text-2xl font-black text-gray-900 tracking-tight">
				Exam Registration
			</h1>
			<p className="text-sm text-gray-500 mt-1">
				{totalExams} exam{totalExams !== 1 ? 's' : ''} available for
				registration
			</p>
		</header>
	);
};

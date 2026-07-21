'use client';

import { IExam, IExamRegistrationProps } from './interface';
import { useExams } from './hooks/useExams';
import { useExamRegistration } from './hooks/useExamRegistration';
import { usePaymentInitiation } from './hooks/usePaymentInitiation';
import { LoadingSkeleton } from './LoadingSkeleton/LoadingSkeleton';
import { ExamRegistrationHeader } from './ExamRegistrationHeader/ExamRegistrationHeader';
import { EmptyState } from '@/src/components/common/EmptyState/EmptyState';
import { Legend } from './Legend/Legend';
import { ExamsTable } from './ExamsTable/ExamsTable';
import { Pagination } from './Pagination/Pagination';
import { RegistrationModal } from './modals/RegistrationModal';
import { NoExamsStory } from '@/src/components/common/EmptyState/EmptyState.stories';
import { toast } from 'react-toastify';

export default function ExamRegistration({
	initialExams,
	initialMeta,
}: IExamRegistrationProps) {
	const {
		exams,
		meta,
		loading,
		selectedExam,
		showModal,
		updateExams,
		setLoadingState,
		openModal,
		closeModal,
		updateExamRegistrationStatus,
	} = useExams(initialExams, initialMeta);

	const { registerExam, loading: registering } = useExamRegistration();
	const { initiatePayment, loading: initiatingPayment } =
		usePaymentInitiation();

	const fetchExams = async (page: number) => {
		setLoadingState(true);
		try {
			const response = await fetch(
				`/api/v1/exams/students/registration?page=${page}&limit=${meta.limit}&sortBy=createdAt&status=UPCOMING`,
			);
			const data = await response.json();
			if (data.success) {
				updateExams(data.data, data.meta);
			}
		} catch (error) {
			console.error('Failed to fetch exams:', error);
		} finally {
			setLoadingState(false);
		}
	};

	const handleRegisterLater = async (
		examId: string,
		level: number,
		semester: number,
	) => {
		const result = await registerExam({ examId, level, semester });
		if (result?.data?.id) {
			updateExamRegistrationStatus(examId, false, result.data.id);
			toast.info('Processing registration. Please wait');
			closeModal();
			return result;
		}

		return result;
	};

	const handleRegisterAndPay = async (
		examId: string,
		level: number,
		semester: number,
	) => {
		const result = await registerExam({ examId, level, semester });
		if (result?.data?.id) {
			updateExamRegistrationStatus(examId, false, result?.data?.id);
			toast.info('Processing registration. Please wait');
			const paymentLink = await initiatePayment(result?.data?.id);
			if (paymentLink && window) {
				window.open(paymentLink, '_blank', 'noopener, noreferrer');
				// window.location.href = paymentLink;
			}
			// closeModal();
			return result;
		}
	};

	const handleRegister = (exam: IExam) => {
		openModal(exam);
	};

	const handleMakePayment = async (exam: IExam) => {
		const paymentLink = await initiatePayment(exam.examRegistrationId!);
		if (paymentLink) {
			window.location.href = paymentLink;
		}
	};

	const handlePageChange = (page: number) => {
		fetchExams(page);
	};

	if (loading) {
		return <LoadingSkeleton />;
	}

	if (exams.length === 0) {
		return (
			<div className="p-8 bg-white min-h-screen font-sans">
				<div className="max-w-6xl mx-auto">
					<ExamRegistrationHeader totalExams={0} />
					<EmptyState
						title={NoExamsStory.args?.title as string}
						description={NoExamsStory.args?.description}
						icon="school"
						size="md"
					/>
					<Legend />
				</div>
			</div>
		);
	}

	return (
		<div className="p-8 bg-white min-h-screen font-sans">
			<div className="max-w-6xl mx-auto">
				<ExamRegistrationHeader totalExams={meta.totalItems} />

				<div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
					<div className="p-6 border-b border-gray-50">
						<h2 className="text-lg font-bold text-gray-800">
							Available Exam Table
						</h2>
					</div>

					<ExamsTable
						exams={exams}
						onRegister={handleRegister}
						onRegisterLoading={registering}
						onPay={handleMakePayment}
						onPayLoading={initiatingPayment}
					/>
				</div>

				<Legend />

				{meta.totalPages > 1 && (
					<Pagination
						currentPage={meta.page}
						totalPages={meta.totalPages}
						hasNextPage={meta.hasNextPage}
						hasPreviousPage={meta.hasPreviousPage}
						onPageChange={handlePageChange}
					/>
				)}
			</div>

			{selectedExam && (
				<RegistrationModal
					exam={selectedExam}
					isOpen={showModal}
					onClose={closeModal}
					onRegisterLater={handleRegisterLater}
					onRegisterAndPay={handleRegisterAndPay}
					isLoading={registering || initiatingPayment}
				/>
			)}
		</div>
	);
}

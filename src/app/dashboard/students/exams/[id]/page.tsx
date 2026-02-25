import ExamDetail from '@/src/components/Dashboard/Student/ExamChart/ExamDetail/ExamDetail';

const ExamDetailsPage = async ({
	params,
}: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await params;
	console.log('id: ', id);
	return <ExamDetail />;
};

export default ExamDetailsPage;

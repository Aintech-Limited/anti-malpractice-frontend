import { useRouter } from 'next/navigation';
import { IExamRowProps } from './interface';
import { toast } from 'react-toastify';

const DashboardExamRow = ({
	time,
	title,
	actionText,
	isLive,
	id,
	isResult,
}: IExamRowProps) => {
	const router = useRouter();
	const date = new Date(time);

	return (
		<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 group p-2 -m-2 rounded-lg hover:bg-gray-50 transition-colors">
			<div className="flex items-center gap-6">
				<span className="bg-[#E9EEF2] px-3 py-1.5 rounded-md text-gray-700 font-bold text-sm min-w-20 max-w-50  text-center group-hover:bg-white group-hover:shadow-sm transition-all break-all">
					{date.toDateString()} <br /> {date.toTimeString()}
				</span>
				<h4 className="text-gray-900 font-bold text-[15px] leading-tight max-w-md group-hover:text-blue-700 transition-colors">
					{title}
				</h4>
			</div>
			<button
				className={`
      px-5 py-2 rounded-md font-bold text-sm transition-all duration-200 whitespace-nowrap self-start sm:self-center
      ${
				isLive
					? 'bg-[#EF5350] text-white hover:bg-[#d32f2f] hover:shadow-lg hover:shadow-red-200'
					: isResult
						? 'bg-[#D1D9E6] text-gray-800 hover:bg-gray-300 hover:shadow-md'
						: 'bg-[#3fb875] text-white hover:bg-[#2eaaa0] hover:shadow-lg hover:shadow-green-200'
			}
      active:scale-95
    `}
				onClick={() => {
					if (isLive) {
						router.push(`/dashboard/students/exams/${id}`);
						return;
					}
					if (isResult) {
						router.push(`/dashboard/students/results/${id}`);
						return;
					}
					toast.info('Read!!! Study!!! Prepare!!!');
				}}
			>
				{actionText}
			</button>
		</div>
	);
};

export default DashboardExamRow;

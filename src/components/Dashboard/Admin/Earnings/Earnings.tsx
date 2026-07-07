'use client';

import {
	ArrowUpRight,
	TrendingUp,
	TrendingDown,
	Plus,
	Calendar,
	ChevronDown,
	MoreHorizontal,
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
} from 'chart.js';
import SalesByCountries from './SalesByCountries/SalesByCountries';
import {
	IEarningDataProps,
	IEarningDataResponse,
	IIncomeStreams,
	ISalesAnalytics,
	ISalesByCountry,
} from './interface';
import { useEffect, useState } from 'react';
import { formatCompactNumber } from './util/util';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
);

export default function Earnings({ initialData }: IEarningDataProps) {
	const [loading, setLoading] = useState<boolean>(false);
	const [productType, setProductType] = useState<
		'EXAM_REGISTRATION' | 'COURSE_MATERIAL'
	>('COURSE_MATERIAL');
	const [incomeStreams, setIncomeStreams] = useState<IIncomeStreams>(() => {
		const income = initialData?.data?.incomeStreams;

		return {
			bonus: income?.bonus ?? 0,
			finance: income?.finance ?? 0,
			income: income?.income ?? 0,
			percentageComparison: income?.percentageComparison ?? 0,
			salary: income?.salary ?? 0,
			todaysEarning: income?.todaysEarning ?? 0,
			total: income?.total ?? 0,
			yesterdaysEarning: income?.yesterdaysEarning ?? 0,
		};
	});
	const [salesByCountry, setSalesByCountry] = useState<ISalesByCountry>(() => {
		const countrySales = initialData?.data?.salesByCountry;

		return {
			offices: countrySales?.offices ?? [],
			period: countrySales?.period ?? '6 Months',
			revenueGrowth: countrySales?.revenueGrowth ?? 0,
			topPerforming: countrySales?.topPerforming ?? 0,
		};
	});
	const [salesAnalytics, setSalesAnalytics] = useState<ISalesAnalytics>(() => {
		const analyticsSales = initialData?.data?.salesAnalytics;

		return {
			activeCustomers: analyticsSales?.activeCustomers ?? 0,
			newRevenue: analyticsSales?.newRevenue ?? 0,
			productSold: analyticsSales?.productSold ?? 0,
			totalSales: analyticsSales?.totalSales ?? 0,
		};
	});

	const incomeData = {
		labels: ['Salary', 'Bonus', 'Finance', 'Income'],
		datasets: [
			{
				data: [
					incomeStreams.salary,
					incomeStreams.bonus,
					incomeStreams.finance,
					incomeStreams.income,
				],
				backgroundColor: ['#22252A', '#E9D5FF', '#3B82F6', '#CCFBF1'],
				borderRadius: 8,
				borderSkipped: false,
			},
		],
	};

	const incomeOptions = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: { legend: { display: false } },
		scales: {
			x: { grid: { display: false }, ticks: { display: false } },
			y: { grid: { display: false }, ticks: { display: false } },
		},
	};

	const gaugeData = {
		datasets: [
			{
				data: [65.4, 34.6],
				backgroundColor: ['#0022FF', '#E2E8F0'],
				borderWidth: 0,
				circumference: 180,
				rotation: 270,
				cutout: '80%',
				borderRadius: 5,
			},
		],
	};

	useEffect(() => {
		const controller = new AbortController();
		const { signal } = controller;

		const getEarningData = async () => {
			try {
				setLoading(true);

				const response = await fetch(
					`/api/v1/admin/earning?salesAnalytics=false&salesByCountry=false&incomeStreams=true&productType=${productType}`,
					{
						method: 'GET',
						signal,
					},
				);

				if (!response.ok) {
					const errorData = (await response.json()) as IEarningDataResponse;
					throw new Error(errorData?.message ?? 'Could not get earning data');
				}

				const data = (await response.json()) as IEarningDataResponse;

				if (data?.success && data?.data?.salesByCountry) {
					const countrySales = data.data.salesByCountry;
					setSalesByCountry(() => {
						return {
							offices: countrySales.offices,
							period: countrySales.period,
							revenueGrowth: countrySales.revenueGrowth,
							topPerforming: countrySales.topPerforming,
						};
					});
				}
				if (data?.success && data?.data?.salesAnalytics) {
					const analytics = data?.data?.salesAnalytics;

					setSalesAnalytics(() => {
						return {
							activeCustomers: analytics.activeCustomers,
							newRevenue: analytics.newRevenue,
							productSold: analytics.productSold,
							totalSales: analytics.totalSales,
						};
					});
				}
				if (data?.success && data?.data?.incomeStreams) {
					const streamIncome = data.data.incomeStreams;
					setIncomeStreams(() => {
						return {
							bonus: streamIncome.bonus,
							finance: streamIncome.finance,
							income: streamIncome.income,
							percentageComparison: streamIncome.percentageComparison,
							salary: streamIncome.salary,
							todaysEarning: streamIncome.todaysEarning,
							total: streamIncome.total,
							yesterdaysEarning: streamIncome.yesterdaysEarning,
						};
					});
				}
			} catch (error: any) {
				if (error.name === 'AbortError') {
					console.log('Aborted');
					return;
				}
				toast.error('Could not get earning data');
			} finally {
				if (!signal.aborted) setLoading(false);
			}
		};
		getEarningData();

		return () => {
			controller.abort();
		};
	}, [productType]);

	return (
		<div className="min-h-screen bg-[#F8FAFC] p-8 text-[#1E293B] font-sans">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
				<h1 className="text-2xl font-bold tracking-tight">Sales Analytics</h1>
				<div className="flex items-center gap-3">
					<button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 transition">
						<Plus className="w-4 h-4" /> Add Widget
					</button>
					<button className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium shadow-sm hover:bg-slate-50 transition">
						<Calendar className="w-4 h-4 text-slate-500" />{' '}
						{dayjs().format('ddd, MM YYYY')}
					</button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
						<div className="flex justify-between items-start mb-4">
							<span className="text-sm font-medium text-slate-500">
								Total Sales
							</span>
							<ArrowUpRight className="w-5 h-5 text-slate-400" />
						</div>
						<h3 className="text-4xl font-bold tracking-tight mb-4">
							₦{salesAnalytics.newRevenue}
						</h3>
						{/* <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
							<TrendingUp className="w-3.5 h-3.5" /> +6.5%{' '}
							<span className="text-slate-400 font-normal ml-0.5">
								This week
							</span>
						</div> */}
					</div>

					<div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
						<div className="flex justify-between items-start mb-4">
							<span className="text-sm font-medium text-slate-500">
								Net Revenue
							</span>
							<ArrowUpRight className="w-5 h-5 text-slate-400" />
						</div>
						<h3 className="text-4xl font-bold tracking-tight mb-4">
							₦{salesAnalytics.newRevenue}
						</h3>
						{/* <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
							<TrendingUp className="w-3.5 h-3.5" /> +8.4%{' '}
							<span className="text-slate-400 font-normal ml-0.5">
								vs last week
							</span>
						</div> */}
					</div>

					<div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
						<div className="flex justify-between items-start mb-4">
							<span className="text-sm font-medium text-slate-500">
								Product Sold
							</span>
							<ArrowUpRight className="w-5 h-5 text-slate-400" />
						</div>
						<h3 className="text-4xl font-bold tracking-tight mb-4">
							{salesAnalytics.productSold} Units
						</h3>
						{/* <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit">
							<TrendingUp className="w-3.5 h-3.5" /> +6.8%{' '}
							<span className="text-slate-400 font-normal ml-0.5">
								Increase
							</span>
						</div> */}
					</div>

					<div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative">
						<div className="flex justify-between items-start mb-4">
							<span className="text-sm font-medium text-slate-500">
								Active Customers
							</span>
							<ArrowUpRight className="w-5 h-5 text-slate-400" />
						</div>
						<h3 className="text-4xl font-bold tracking-tight mb-4">
							{salesAnalytics.activeCustomers}
						</h3>
						{/* <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-1 rounded-md w-fit">
							<TrendingDown className="w-3.5 h-3.5 rotate-180" /> +8.4%{' '}
							<span className="text-slate-400 font-normal ml-0.5">
								Customer expanded
							</span>
						</div> */}
					</div>
				</div>

				<SalesByCountries data={salesByCountry} />

				<div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
					<div className="flex justify-between items-center mb-6">
						<div>
							<h2 className="font-bold text-lg mb-2">Income Streams</h2>
							<button className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-md shadow-blue-200">
								Last 28 Days
							</button>
						</div>
						<div className="flex gap-4 text-xs font-medium text-slate-600">
							{/* <button className="flex items-center gap-1">
								All Products <ChevronDown className="w-3 h-3" />
							</button> */}
							<select
								name="productType"
								id="productType"
								onChange={(e) => {
									setProductType(e.target.value as any);
								}}
								value={productType}
							>
								<option value="EXAM_REGISTRATION">Exam Registration</option>
								<option value="COURSE_MATERIAL">Course Material</option>
							</select>
							<button className="flex items-center gap-1">
								Top Countries <ChevronDown className="w-3 h-3" />
							</button>
							<ArrowUpRight className="w-4 h-4 text-slate-400" />
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
						<div>
							<h4 className="text-4xl font-bold tracking-tight mb-1">
								₦{incomeStreams.total}
							</h4>
							<p className="text-xs text-slate-400 mb-6">
								Income Sources Statistic in a month
							</p>

							<div className="grid grid-cols-2 gap-y-2 text-xs font-medium text-slate-700">
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-3 bg-black rounded-sm"></span> Salary
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-3 bg-purple-200 rounded-sm"></span>{' '}
									Bonus
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-3 bg-blue-500 rounded-sm"></span>{' '}
									Finance
								</div>
								<div className="flex items-center gap-2">
									<span className="w-1.5 h-3 bg-teal-200 rounded-sm"></span>{' '}
									Income
								</div>
							</div>
						</div>

						<div className="md:col-span-2 relative pt-8">
							<div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-50 text-[11px] font-bold px-2 py-1 rounded border border-slate-100 text-slate-500">
								{incomeStreams.percentageComparison}%{' '}
								<span className="font-normal text-slate-400">
									{incomeStreams.percentageComparison > 0 ? 'Better' : 'Worse'}{' '}
									than last month
								</span>
							</div>
							<div className="h-40 relative flex items-end justify-between px-4 border-2 border-dashed border-slate-100 rounded-xl p-3">
								<div className="w-16 h-full flex flex-col justify-end items-center relative">
									<span className="absolute bottom-[54%] bg-neutral-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
										{formatCompactNumber(incomeStreams.salary)}{' '}
										<TrendingDown className="w-2.5 h-2.5 text-rose-400 rotate-180" />
									</span>
									<div className="w-full h-[50%] bg-neutral-800 rounded-lg"></div>
								</div>
								<div className="w-16 h-full flex flex-col justify-end items-center relative">
									<span className="absolute bottom-[74%] bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
										{formatCompactNumber(incomeStreams.bonus)}{' '}
										<TrendingUp className="w-2.5 h-2.5" />
									</span>
									<div className="w-full h-[70%] bg-purple-200 rounded-lg"></div>
								</div>
								<div className="w-16 h-full flex flex-col justify-end items-center relative">
									<span className="absolute bottom-[94%] bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
										{formatCompactNumber(incomeStreams.finance)}{' '}
										<TrendingUp className="w-2.5 h-2.5" />
									</span>
									<div className="w-full h-[90%] bg-blue-500 rounded-xl border-2 border-dashed border-blue-600"></div>
								</div>
								<div className="w-16 h-full flex flex-col justify-end items-center relative">
									<span className="absolute bottom-[64%] bg-teal-100 text-teal-700 text-[10px] font-bold px-1.5 py-0.5 rounded shadow flex items-center gap-0.5">
										{formatCompactNumber(incomeStreams.income)}{' '}
										<TrendingUp className="w-2.5 h-2.5" />
									</span>
									<div className="w-full h-[60%] bg-teal-100 rounded-lg"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
					<div className="flex justify-between items-center">
						<div className="flex items-center gap-2 text-sm font-bold">
							<span className="w-1.5 h-3.5 bg-blue-600 rounded-sm"></span> Sales
							Overview
						</div>
						<MoreHorizontal className="w-5 h-5 text-slate-400 cursor-pointer" />
					</div>

					<div className="relative flex flex-col items-center justify-center my-6">
						<div className="w-48 h-24 relative overflow-hidden">
							<Doughnut
								data={gaugeData}
								options={{
									responsive: true,
									maintainAspectRatio: false,
									plugins: {
										legend: { display: false },
										tooltip: { enabled: false },
									},
								}}
							/>
						</div>
						<div className="text-center -mt-6">
							<span className="text-3xl font-black text-blue-700 tracking-tight">
								{incomeStreams.todaysEarning - incomeStreams.yesterdaysEarning}%
							</span>
							<p className="text-[11px] font-medium text-slate-400 mt-1">
								Performance Score
							</p>
						</div>
					</div>

					<p className="text-center text-xs font-medium text-slate-600 px-4 leading-relaxed">
						You earned{' '}
						<span className="font-bold text-black">
							₦{incomeStreams.todaysEarning}
						</span>{' '}
						today, outpacing yesterday&apos;s record.
					</p>
				</div>
			</div>
		</div>
	);
}

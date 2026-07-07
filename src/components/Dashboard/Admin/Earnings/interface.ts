export interface IOfficeRevenue {
	name: string;
	amount: number;
}

export interface ISalesAnalytics {
	totalSales: number;
	productSold: number;
	newRevenue: number;
	activeCustomers: number;
}

export interface ISalesByCountry {
	period: string;
	topPerforming: number;
	revenueGrowth: number;
	offices: IOfficeRevenue[];
}

export interface IIncomeStreams {
	total: number;
	salary: number;
	finance: number;
	bonus: number;
	income: number;
	percentageComparison: number;
	todaysEarning: number;
	yesterdaysEarning: number;
}

export interface IEarningsData {
	salesAnalytics: ISalesAnalytics;
	salesByCountry: ISalesByCountry;
	incomeStreams: IIncomeStreams;
}

export interface IEarningDataResponse {
	message: string;
	success: boolean;
	data: IEarningsData;
}

export interface IEarningDataProps {
	initialData: IEarningDataResponse;
}

"use client";

import { IVendorsDashboardProps } from "./interface";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { StatCard } from "./StatCard/StatCard";
import { useAuth } from "@/src/providers/auth/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const VendorsDashboard = ({ initialData }: IVendorsDashboardProps) => {
  const { user } = useAuth();
  const { stats, barchart, lastestPurchase } = initialData?.data || {
    stats: { booksAdded: 0, booksApproved: 0, booksSold: 0 },
    barchart: [],
    lastestPurchase: [],
  };

  const todayDate = format(new Date(), "EEEE, MMMM d, yyyy");

  const chartData = {
    labels: barchart.map((item) => item.label),
    datasets: [
      {
        label: "Books Sold",
        data: barchart.map((item) => item.value),
        backgroundColor: "rgba(59, 130, 246, 0.85)",
        hoverBackgroundColor: "rgba(37, 99, 235, 1)",
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1e293b",
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: { precision: 0 },
      },
    },
  };
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-200 pb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Welcome back, {user?.firstName ?? "Vendor"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here is what is happening with your store today.
          </p>
        </div>
        <span className="text-sm font-medium text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
          {todayDate}
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        <StatCard
          title="Books Added"
          value={stats.booksAdded}
          color="border-l-blue-500"
        />
        <StatCard
          title="Books Approved"
          value={stats.booksApproved}
          color="border-l-emerald-500"
        />
        <StatCard
          title="Books Sold"
          value={stats.booksSold}
          color="border-l-indigo-500"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Books Sold This Year
          </h2>
          <div className="h-72">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Latest Purchases
            </h2>
            {lastestPurchase.length === 0 ? (
              <p className="text-slate-400 text-sm py-4">
                No recent purchases found.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {lastestPurchase.map((item) => (
                  <li
                    key={item.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {item.student
                          ? `${item?.student?.firstName ?? ""} ${item?.student?.lastName ?? ""}`
                          : "Guest Student"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {format(new Date(item.createdAt), "MMM d, yyyy • p")}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.currency} {Number(item.amount).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VendorsDashboard;

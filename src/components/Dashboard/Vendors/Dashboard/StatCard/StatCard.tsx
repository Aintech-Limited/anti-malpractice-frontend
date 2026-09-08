export const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: string;
}) => (
  <div
    className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 ${color}`}
  >
    <p className="text-sm font-medium text-slate-500">{title}</p>
    <p className="text-3xl font-bold text-slate-800 mt-2">
      {value.toLocaleString()}
    </p>
  </div>
);

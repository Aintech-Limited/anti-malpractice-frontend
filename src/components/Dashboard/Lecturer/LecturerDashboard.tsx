import {
	LayoutDashboard,
	Users,
	BookOpen,
	MessageSquare,
	Bell,
	LogOut,
	Plus,
	ChevronRight,
	ChevronDown,
} from 'lucide-react';

const LecturerDashboard = () => {
	return (
		<div className="flex min-h-screen bg-[#F1F5F9] font-sans">
			<aside className="w-64 bg-blue-700 text-white flex flex-col fixed h-full z-20">
				<div className="p-6">
					<div className="bg-white/10 p-2 rounded-lg flex items-center gap-3 mb-8">
						<LayoutDashboard size={20} />
						<span className="font-bold">Overview</span>
					</div>

					<nav className="space-y-6">
						<SidebarGroup title="Lecturer" icon={<Users size={18} />} active>
							<li className="text-blue-100 text-sm py-1 hover:text-white cursor-pointer">
								Lecturer List
							</li>
							<li className="text-blue-100 text-sm py-1 hover:text-white cursor-pointer">
								Performance
							</li>
						</SidebarGroup>

						<SidebarGroup title="Exam" icon={<BookOpen size={18} />}>
							<li className="text-blue-100 text-sm py-1">Create Exam Form</li>
							<li className="text-blue-100 text-sm py-1">Ongoing Exam</li>
						</SidebarGroup>
					</nav>
				</div>

				<div className="mt-auto p-6 space-y-4 border-t border-blue-600">
					<div className="flex items-center gap-3 text-blue-100 hover:text-white cursor-pointer transition-colors">
						<MessageSquare size={18} /> <span>Chat</span>
					</div>
					<div className="flex items-center justify-between text-blue-100 hover:text-white cursor-pointer">
						<div className="flex items-center gap-3">
							<Bell size={18} /> <span>Notification</span>
						</div>
						<div className="w-2 h-2 bg-red-500 rounded-full"></div>
					</div>
					<div className="flex items-center gap-3 text-blue-100 hover:text-white cursor-pointer pt-4">
						<LogOut size={18} /> <span>Log out</span>
					</div>
				</div>
			</aside>

			<main className="flex-1 ml-64 p-8">
				<div className="mb-10">
					<div className="flex justify-between items-center mb-6">
						<h2 className="text-xl font-bold text-gray-800">Notification</h2>
						<button className="text-blue-600 text-sm font-bold hover:underline">
							See All
						</button>
					</div>
					<div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
						<NotificationItem
							title="Math Exam 2025"
							time="8m ago"
							date="May 15th, 2025"
						/>
						<NotificationItem
							title="Digital Electronics Exam"
							time="23m ago"
							date="Aug 27th, 2025"
						/>
						<NotificationItem
							title="English Exam 2025"
							time="6h ago"
							date="Jun 15th, 2025"
							border={false}
						/>
					</div>
				</div>

				<SectionHeader title="Exam Overview" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
					<StatCard label="Total Exams" value="19" />
					<StatCard label="Completed Exams" value="2" />
					<StatCard label="Needs Approval" value="0" />
					<StatCard label="Draft Exams" value="12" />
					<StatCard label="Live Exam" value="7" color="text-red-500" />
					<StatCard label="Upcoming Exams" value="2" />
					<StatCard label="Practice Exams" value="13" />
					<ActionCard label="Create a new exam" icon={<Plus />} />
				</div>

				<SectionHeader title="Lecturers Summary" />
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
					<StatCard label="Total Lecturers" value="78" />
					<StatCard label="Assigned Lecturers" value="12" />
					<StatCard label="Available Lecturers" value="77" />
					<ActionCard label="Add new lecturer" icon={<Plus />} />
				</div>
			</main>
		</div>
	);
};

const SidebarGroup = ({ title, icon, children, active = false }: any) => (
	<div>
		<div
			className={`flex items-center justify-between mb-2 cursor-pointer ${active ? 'text-white' : 'text-blue-200'}`}
		>
			<div className="flex items-center gap-3 font-bold">
				{icon} <span>{title}</span>
			</div>
			<ChevronDown size={16} />
		</div>
		<ul className="pl-8 space-y-1 border-l border-blue-500/30 ml-2">
			{children}
		</ul>
	</div>
);

const NotificationItem = ({ title, time, date, border = true }: any) => (
	<div
		className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${border ? 'border-b border-gray-100' : ''}`}
	>
		<div className="flex justify-between mb-1">
			<h4 className="font-bold text-gray-800 text-sm">Upcoming Exam</h4>
			<span className="text-gray-400 text-xs">{time}</span>
		</div>
		<p className="text-xs text-gray-600 font-medium">
			Title: {title}, Date: {date}
		</p>
		<p className="text-[10px] text-gray-400 mt-1">
			Reminder for the upcoming exam scheduled on {date}. Make sure preparations
			are in place.
		</p>
	</div>
);

const SectionHeader = ({ title }: { title: string }) => (
	<h2 className="text-xl font-bold text-gray-800 mb-6">{title}</h2>
);

const StatCard = ({ label, value, color = 'text-gray-800' }: any) => (
	<div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
		<p className="text-xs font-bold text-gray-500 mb-4 group-hover:text-blue-600 transition-colors">
			{label}
		</p>
		<p className={`text-3xl font-bold text-right ${color}`}>{value}</p>
	</div>
);

const ActionCard = ({ label, icon }: any) => (
	<div className="bg-[#E2E8F0] p-6 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-200 hover:border-blue-400 transition-all text-gray-600 hover:text-blue-600">
		<div className="p-1 bg-white rounded-full shadow-sm">{icon}</div>
		<span className="text-xs font-bold">{label}</span>
	</div>
);

export default LecturerDashboard;

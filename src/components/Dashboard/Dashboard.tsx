"use client";

const Dashboard = () => {
  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      <aside className="w-64 border-r border-gray-200 bg-white p-4 hidden md:flex md:flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="h-8 w-36 bg-gray-200 rounded-md animate-pulse" />

          <div className="space-y-3 pt-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-md"
              >
                <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
                <div
                  className="h-4 bg-gray-200 rounded animate-pulse"
                  style={{ width: `${Math.floor(1 * 40) + 50}%` }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-2 border-t border-gray-100">
          <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse shrink-0" />
          <div className="space-y-1.5 w-full">
            <div className="h-3.5 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-2.5 w-16 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between shrink-0">
          <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
            <div className="h-9 w-9 rounded-full bg-gray-200 animate-pulse" />
          </div>
        </header>

        <main className="p-6 space-y-6 max-w-7xl w-full mx-auto">
          <div className="flex justify-between items-center">
            <div className="h-8 w-64 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse" />
                </div>
                <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1.5">
                  <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
              </div>

              <div className="h-64 pt-8 flex items-end justify-between gap-3 px-4">
                {[60, 40, 75, 90, 50, 85, 45, 70, 95, 30, 65, 80].map(
                  (heightPercent, idx) => (
                    <div
                      key={idx}
                      className="w-full bg-gray-200 rounded-t animate-pulse transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="h-5 w-36 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
              </div>

              <div className="flex justify-center items-center py-6">
                <div className="h-44 w-44 rounded-full border-16 border-gray-200 border-t-blue-100 animate-pulse flex items-center justify-center" />
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
                  <div className="h-3 w-8 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="h-10 w-full bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

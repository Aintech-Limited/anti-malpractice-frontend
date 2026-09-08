export default function PaymentsSkeleton() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-200 rounded-lg w-64 mb-8"></div>
          <div className="h-20 bg-gray-200 rounded-lg mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

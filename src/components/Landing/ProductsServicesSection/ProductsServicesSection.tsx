import {
  Book,
  GraduationCap,
  Monitor,
  Box,
  Users,
  Ticket,
  MousePointer2,
} from "lucide-react";
import ServiceCard from "./ServiceCard/ServiceCard";

const FloatingCursor = ({
  className,
  color,
  name,
}: {
  className: string;
  color: string;
  name: string;
}) => (
  <div
    className={`absolute z-10 flex flex-col items-center pointer-events-none ${className}`}
  >
    <MousePointer2
      size={24}
      fill={color}
      className={`text-${color}-500 stroke-white stroke-[3px]`}
    />
    <span
      className={`mt-1 px-2 py-0.5 rounded-md text-[10px] text-white font-bold shadow-sm bg-${color}-500`}
    >
      {name}
    </span>
  </div>
);

const ProductsServicesSection = () => {
  const ProductServicesData = [
    {
      icon: <Book size={32} />,
      title: "Ebooks",
      description: "Lorem ipsum dolor sit amet consectetur...",
      iconBg: "bg-gray-100",
    },
    {
      icon: <GraduationCap size={32} />,
      title: "Courses and membership",
      description: "Pretium imperdiet duis enim non...",
      iconBg: "bg-green-100",
    },
    {
      icon: <Monitor size={32} />,
      title: "Digital Products",
      description: "Pretium imperdiet duis enim non...",
      iconBg: "bg-blue-100",
    },
    {
      icon: <Box size={32} />,
      title: "Physical Goods",
      description: "Pretium imperdiet duis enim non...",
      iconBg: "bg-emerald-50",
    },
    {
      icon: <Users size={32} />,
      title: "Services",
      description: "Gravida nisl risus vitae justo...",
      iconBg: "bg-orange-50",
    },
    {
      icon: <Ticket size={32} />,
      title: "Event tickets and training",
      description: "Pretium imperdiet duis enim non...",
      iconBg: "bg-indigo-100",
    },
  ];

  return (
    <section className="bg-white py-20 px-6 md:px-12 m-4 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">
        {/* Floating Cursors */}
        <div className="hidden lg:block">
          <FloatingCursor
            name="Lekan"
            color="blue"
            className="top-1/4 left-1/4 animate-cursor-1"
          />
          <FloatingCursor
            name="Sarah"
            color="green"
            className="top-1/2 right-1/4 animate-cursor-2"
          />
          <FloatingCursor
            name="Amara"
            color="orange"
            className="bottom-1/5 left-1/4 animate-cursor-3"
          />
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-24 max-w-3xl mx-auto leading-tight">
          Sell any kind of Educational product, service or subscription
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20 relative z-0">
          {ProductServicesData.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
              iconBg={service.iconBg}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsServicesSection;

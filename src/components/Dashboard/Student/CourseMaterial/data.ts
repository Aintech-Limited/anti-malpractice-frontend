import { Book, CheckCircle, Clock, Star } from "lucide-react";
import { IMaterialCardProps } from "./MaterialCard/interface";
import { IStatCardProps } from "./StatCard/interface";

export const courseStats: IStatCardProps[] = [
  {
    id: "total",
    title: "Total eBooks Purchased",
    count: 12,
    footerText: "Shows total count",
    icon: Book,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "inProgress",
    title: "In Progress",
    count: 200,
    footerText: "Books currently being read",
    icon: Clock,
    iconBg: "bg-green-50",
    iconColor: "text-green-600",
  },
  {
    id: "completed",
    title: "Completed",
    count: 185,
    footerText: "Finished books",
    icon: CheckCircle,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-600",
  },
  {
    id: "wishlist",
    title: "Wishlist",
    count: 14,
    footerText: "Saved but not purchased",
    icon: Star,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-600",
  },
];

export const courseMaterials: IMaterialCardProps[] = [
  {
    title: "Things Fall Apart",
    // author: 'Chinua ACHEBE',
    price: "$6.5",
    lecturer: { firstName: "Nnamdi", id: "1", lastName: "John" },
    courseCode: "GST224",
    purchasedAt: "3rd Jan. 2025",
    progress: 48,
    rating: 4,
    fileType: "",
    fileURL: "",
    id: "1",
    MaterialCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
  },
  {
    title: "Mama's Sleeping Scarf",
    // author: 'Chimamanda Ngozi Adichie',
    price: "$45",
    lecturer: { firstName: "Nnamdi", id: "1", lastName: "John" },
    courseCode: "HST324",
    purchasedAt: "5th Jan. 2025",
    progress: 63,
    rating: 3,
    fileType: "",
    fileURL: "",
    id: "2",
    MaterialCover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400",
  },
];

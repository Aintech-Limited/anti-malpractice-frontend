"use client";

import {
  X,
  Users,
  Briefcase,
  BookOpen,
  Target,
  Eye,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Award,
  Heart,
  Loader,
} from "lucide-react";
import Image from "next/image";
import { IDepartmentModalProps } from "./interface";

export const DepartmentModal = ({
  department,
  stats,
  loading,
  error,
  onClose,
}: IDepartmentModalProps) => {
  return (
    <div className="fixed inset-0 backdrop-blur-md bg-black/50 bg-opacity-50 flex items-center justify-center z-10 animate-fadeIn p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[80vh] overflow-y-auto transform transition-all animate-slideUp mt-30">
        {/* Hero Image */}
        <div className="relative h-64 rounded-t-2xl overflow-hidden">
          <Image
            src={
              department.imageURL ||
              "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3"
            }
            alt={department.name}
            width={800}
            height={400}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{department.name}</h2>
            <p className="text-white/90">Department of {department.name}</p>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  About the Department
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {department.description}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-xl p-4 text-center">
                  <Users className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.students?.toLocaleString() ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Students</p>
                </div>
                <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-xl p-4 text-center">
                  <Briefcase className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.faculty ?? "N/A"}
                  </p>
                  <p className="text-sm text-gray-600">Faculty Members</p>
                </div>
                <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-xl p-4 text-center">
                  <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.courses ?? 0}
                  </p>
                  <p className="text-sm text-gray-600">Courses</p>
                </div>
                <div className="bg-linear-to-br from-orange-50 to-red-50 rounded-xl p-4 text-center">
                  <Target className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-800">
                    {stats?.researchGroups ?? 0}
                  </p>
                  <p className="text-sm text-gray-600">Research Groups</p>
                </div>
              </div>

              {/* Vision & Mission */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-800">Vision</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {stats?.vision ?? "N/A"}
                  </p>
                </div>
                <div className="bg-green-50 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Target className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-800">Mission</h3>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {stats?.mission ?? "N/A"}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Contact Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {stats?.location ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {stats?.email ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      {stats?.phone ?? "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">
                      Est. {stats?.established ?? "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-gray-800">
                    Key Achievements
                  </h3>
                </div>
                <ul className="space-y-2">
                  {stats?.achievements?.map((achievement, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <Heart className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

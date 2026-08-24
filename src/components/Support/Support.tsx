"use client";

import { useState } from "react";
import {
  Search,
  MessageCircle,
  ChevronRight,
  ThumbsUp,
  Eye,
  BookOpen,
  HelpCircle,
  CreditCard,
  FileText,
  User,
  Camera,
  X,
  Send,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ISupportProps, ISupportTicket } from "./interface";

const getCategoryIcon = (iconName: string) => {
  switch (iconName) {
    case "account":
      return <User className="w-6 h-6" />;
    case "payment":
      return <CreditCard className="w-6 h-6" />;
    case "course":
      return <BookOpen className="w-6 h-6" />;
    case "technical":
      return <HelpCircle className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
};

const Support = ({ initialArticles, initialCategories }: ISupportProps) => {
  const [activeTab, setActiveTab] = useState<"articles" | "ticket">("articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [articles, setArticles] = useState(initialArticles);
  const [categories] = useState(initialCategories);

  // Ticket form state
  const [ticket, setTicket] = useState<ISupportTicket>({
    subject: "",
    category: "",
    message: "",
    priority: "medium",
    attachments: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  // Filter articles based on search and category
  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    setTicket((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...imageFiles],
    }));

    // Create preview URLs
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (index: number) => {
    setTicket((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      formData.append("subject", ticket.subject);
      formData.append("category", ticket.category);
      formData.append("message", ticket.message);
      formData.append("priority", ticket.priority);

      ticket.attachments.forEach((file, index) => {
        formData.append(`attachments`, file);
      });

      const response = await fetch("/api/v1/support/tickets", {
        // TODO: Add endpoint to BE
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to submit ticket");
      }

      setSubmitSuccess(true);
      setTicket({
        subject: "",
        category: "",
        message: "",
        priority: "medium",
        attachments: [],
      });
      setImagePreviews([]);

      // Reset success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit ticket",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleArticleHelpful = async (
    articleId: string,
    wasHelpful: boolean,
  ) => {
    try {
      await fetch("/api/v1/support/articles/helpful", {
        // TODO: Add endpoint to BE
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ articleId, wasHelpful }),
        credentials: "include",
      });

      // Update local state
      setArticles((prev) =>
        prev.map((article) =>
          article.id === articleId
            ? { ...article, helpful: article.helpful + (wasHelpful ? 1 : 0) }
            : article,
        ),
      );
    } catch (error) {
      console.error("Error recording feedback:", error);
    }
  };

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("articles")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "articles"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <BookOpen className="w-4 h-4 inline mr-2" />
          Knowledge Base
        </button>
        <button
          onClick={() => setActiveTab("ticket")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "ticket"
              ? "text-blue-600 border-b-2 border-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <MessageCircle className="w-4 h-4 inline mr-2" />
          Submit Ticket
        </button>
      </div>

      {activeTab === "articles" && (
        <div>
          <div className="mb-8">
            <div className="relative max-w-xl mx-auto mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                href={`/support/articles/${article.slug}`}
                className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                        {getCategoryIcon(article.category)}
                      </div>
                      <span className="text-xs text-gray-500">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        {article.helpful}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 group-hover:text-blue-600">
                      Read more
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No articles found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search or browse by category
              </p>
            </div>
          )}
        </div>
      )}

      {/* Submit Ticket Tab */}
      {activeTab === "ticket" && (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Submit a Support Ticket
            </h2>

            {submitSuccess && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-green-800 font-medium">
                    Ticket submitted successfully!
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Our support team will respond within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-red-800 font-medium">
                    Error submitting ticket
                  </p>
                  <p className="text-xs text-red-700 mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitTicket} className="space-y-6">
              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={ticket.subject}
                  onChange={(e) =>
                    setTicket((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  placeholder="Brief description of your issue"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={ticket.category}
                  onChange={(e) =>
                    setTicket((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  <option value="account">Account Issues</option>
                  <option value="payment">Payment & Billing</option>
                  <option value="course">Course Access</option>
                  <option value="technical">Technical Problems</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <div className="flex gap-4">
                  {(["low", "medium", "high"] as const).map((priority) => (
                    <label key={priority} className="flex items-center gap-2">
                      <input
                        type="radio"
                        value={priority}
                        checked={ticket.priority === priority}
                        onChange={(e) =>
                          setTicket((prev) => ({
                            ...prev,
                            priority: e.target.value as any,
                          }))
                        }
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700 capitalize">
                        {priority}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={6}
                  value={ticket.message}
                  onChange={(e) =>
                    setTicket((prev) => ({ ...prev, message: e.target.value }))
                  }
                  placeholder="Describe your issue in detail..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Screenshots / Images
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Camera className="w-8 h-8 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Click to upload screenshots
                    </span>
                    <span className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={preview}
                            alt={`Screenshot ${index + 1}`}
                            width={200}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Submit Ticket
                  </>
                )}
              </button>
            </form>

            {/* Support Info */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Need immediate help?
                  </p>
                  <p className="text-sm text-gray-600">
                    Check our knowledge base first - you might find your answer
                    there!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;

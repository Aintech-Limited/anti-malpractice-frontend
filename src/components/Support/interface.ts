export interface ISupportArticle {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  slug: string;
  views: number;
  helpful: number;
  createdAt: string;
}

export interface ISupportCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface ISupportTicket {
  subject: string;
  category: string;
  message: string;
  priority: "low" | "medium" | "high";
  attachments: File[];
}

export interface ISupportProps {
  initialArticles: ISupportArticle[];
  initialCategories: ISupportCategory[];
}

export interface ISupportArticlesReponse {
  message: string;
  success: boolean;
  data: {
    categories: ISupportCategory[];
    articles: ISupportArticle[];
  };
}

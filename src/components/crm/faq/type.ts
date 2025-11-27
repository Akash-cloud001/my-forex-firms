export interface IFaqCategory {
  _id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  totalFaq?: number;
}

export interface IFaq {
  _id: string;
  question: string;
  answer: string;
  categoryId: string | { _id: string; name: string };
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFormData {
  name: string;
  description: string;
}

export interface FaqFormData {
  question: string;
  answer: string;
}
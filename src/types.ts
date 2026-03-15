export type Category = 'Internships' | 'Events' | 'Competitions' | 'Scholarships' | 'Jobs' | 'Fellowships' | 'Conferences' | 'Grants' | 'General';

export interface Opportunity {
  id: string;
  title: string;
  organization?: string;
  description: string;
  category: Category;
  location?: string;
  deadline?: string;
  applyLink?: string;
  tags?: string[];
  rawTelegramText?: string;
  isApproved: boolean;
  isFeatured: boolean;
  viewCount: number;
  createdAt: string;
  field?: string;
  isRemote?: boolean;
  seoArticle?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  role: 'admin' | 'user';
  createdAt: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  opportunityId: string;
  createdAt: string;
}

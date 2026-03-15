import { LucideIcon } from 'lucide-react';

export type Category = 
  | 'Internships' 
  | 'Events' 
  | 'Competitions' 
  | 'Scholarships' 
  | 'Jobs' 
  | 'Fellowships' 
  | 'Conferences' 
  | 'Grants' 
  | 'General Opportunities';

export type OpportunityStatus = 'pending' | 'approved' | 'expired';

export interface Opportunity {
  id: string;
  title: string;
  category: Category;
  organization: string;
  location: string;
  deadline: string;
  postedAt: string;
  applyLink: string;
  description: string;
  tags: string[];
  status: OpportunityStatus;
  isFeatured?: boolean;
  image?: string;
  duration?: string;
  eligibility?: string;
  eventDate?: string;
  field?: string;
  isRemote?: boolean;
  views: number;
}

export interface User {
  id: string;
  email: string;
  bookmarks: string[];
}
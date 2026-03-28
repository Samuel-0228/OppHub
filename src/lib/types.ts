export interface Post {
  id: string;
  telegram_id?: string;
  title: string;
  type: string;
  organization: string;
  location: string;
  deadline?: string;
  apply_link?: string;
  description: string;
  category: string;
  tags: string[] | string;
  status: 'pending' | 'approved' | 'rejected';
  is_pinned: boolean;
  is_featured: boolean;
  view_count: number;
  created_at: string;
}

export type Category = 'Internships' | 'Events' | 'Competitions' | 'Scholarships' | 'Jobs' | 'Fellowships' | 'Conferences' | 'Grants' | 'General';

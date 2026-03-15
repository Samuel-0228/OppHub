import { Opportunity } from '../types';
import { addDays, subDays } from 'date-fns';

const now = new Date();

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: '1',
    title: 'Google Summer Internship 2026',
    category: 'Internships',
    organization: 'Google',
    location: 'Mountain View, CA',
    deadline: addDays(now, 2).toISOString(),
    postedDate: subDays(now, 1).toISOString(),
    applyLink: 'https://careers.google.com',
    description: 'Join Google for an immersive summer internship experience where you will work on real projects that impact millions of users worldwide. You will be mentored by industry experts and build skills in software engineering, data analysis, or product management.',
    shortDescription: 'Software Engineering internship for undergraduate and graduate students.',
    tags: ['Technology', 'AI', 'Software Development'],
    remote: false,
    field: 'Tech',
    status: 'Approved',
    views: 1240,
    isFeatured: true,
    duration: '12 Weeks',
    eligibility: 'Current university students',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/internship-hero-05fdaa78-1773568986811.webp'
  },
  {
    id: '2',
    title: 'Global Tech Conference 2024',
    category: 'Conferences',
    organization: 'TechVision Foundation',
    location: 'London, UK',
    deadline: addDays(now, 15).toISOString(),
    postedDate: subDays(now, 3).toISOString(),
    applyLink: 'https://techvision.com/conference',
    description: 'The premier global event for technology leaders and innovators. Join thousands of attendees for three days of keynotes, workshops, and networking.',
    shortDescription: "The world's largest gathering of tech innovators and visionary leaders.",
    tags: ['Technology', 'Networking', 'Innovation'],
    remote: false,
    field: 'Tech',
    status: 'Approved',
    views: 850,
    eventDate: addDays(now, 45).toISOString(),
    organizer: 'TechVision Foundation',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/event-hero-283a231d-1773568987042.webp'
  },
  {
    id: '3',
    title: 'STEM Scholarship for Future Leaders',
    category: 'Scholarships',
    organization: 'Bright Minds Fund',
    location: 'Global',
    deadline: addDays(now, 5).toISOString(),
    postedDate: subDays(now, 2).toISOString(),
    applyLink: 'https://brightminds.org/scholarship',
    description: 'Supporting the next generation of STEM leaders with full-tuition scholarships for undergraduate programs in Science, Technology, Engineering, or Math.',
    shortDescription: 'Full-tuition scholarship for undergraduate STEM students worldwide.',
    tags: ['Engineering', 'Research', 'Education'],
    remote: true,
    field: 'Engineering',
    status: 'Approved',
    views: 3200,
    awardAmount: '$50,000',
    eligibility: 'High school seniors or current university freshmen',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/scholarship-hero-1185c5d1-1773568987277.webp'
  },
  {
    id: '4',
    title: 'Innovation Startup Challenge',
    category: 'Competitions',
    organization: 'VenturePulse',
    location: 'Remote',
    deadline: addDays(now, 25).toISOString(),
    postedDate: subDays(now, 10).toISOString(),
    applyLink: 'https://venturepulse.ai/challenge',
    description: 'Pitch your startup idea to top VCs and win seed funding to accelerate your growth. Open to student entrepreneurs and early-stage founders.',
    shortDescription: 'Global pitch competition with $100k in non-dilutive funding.',
    tags: ['Entrepreneurship', 'AI', 'Business'],
    remote: true,
    field: 'Business',
    status: 'Approved',
    views: 940,
    prizePool: '$100,000',
    imageUrl: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/competition-hero-b76a3360-1773568987449.webp'
  }
];

export const RAW_TELEGRAM_POSTS = [
  {
    id: 'tg_1',
    content: `🚀 NEW INTERNSHIP: Microsoft Software Engineering Intern 2026!
    
🏢 Company: Microsoft
📍 Location: Redmond, WA (Hybrid)
📅 Deadline: Oct 15, 2024
⏳ Duration: 12-16 weeks
✅ Eligibility: Enrolled in CS or related degree

Apply now: https://careers.microsoft.com/students

Don't miss out on this opportunity to work with the best!`,
    timestamp: subDays(now, 0.5).toISOString()
  },
  {
    id: 'tg_2',
    content: `🌍 Global Youth Summit 2025
    
Organizer: Youth Voices UN
Date: Jan 10-14, 2025
Location: Geneva, Switzerland
Registration Deadline: Nov 1, 2024

Join 500 delegates from around the world to discuss climate policy and global health.

Link: https://youthsummit.un.org/register`,
    timestamp: subDays(now, 0.1).toISOString()
  }
];
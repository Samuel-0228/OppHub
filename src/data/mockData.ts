import { Opportunity } from '../types';
import { addDays, subDays } from 'date-fns';

const now = new Date();

export const mockOpportunities: Opportunity[] = [
  {
    id: "1",
    title: "Google Summer Internship 2026",
    category: "Internships",
    organization: "Google",
    location: "Mountain View, CA",
    deadline: addDays(now, 2).toISOString(),
    postedAt: subDays(now, 1).toISOString(),
    applyLink: "https://google.com/careers",
    description: "Join Google for a 12-week summer internship program. Work on real-world projects and learn from the best in the industry.",
    tags: ["Technology", "AI", "Software Engineering"],
    status: "approved",
    isFeatured: true,
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/internship-thumbnail-ed425ab9-1773569648647.webp",
    duration: "3 Months",
    eligibility: "Currently enrolled in a Bachelor's degree",
    field: "Tech",
    isRemote: false,
    views: 1250
  },
  {
    id: "2",
    title: "Global Tech Conference 2025",
    category: "Events",
    organization: "TechConnect",
    location: "London, UK",
    deadline: addDays(now, 5).toISOString(),
    postedAt: subDays(now, 2).toISOString(),
    applyLink: "https://techconnect.org",
    description: "The biggest tech event of the year, featuring speakers from top companies and networking opportunities.",
    tags: ["Technology", "Networking", "Innovation"],
    status: "approved",
    eventDate: "Sept 15, 2025",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/event-thumbnail-353d2267-1773569655504.webp",
    field: "Tech",
    isRemote: true,
    views: 840
  },
  {
    id: "3",
    title: "Postgrad Excellence Scholarship",
    category: "Scholarships",
    organization: "Oxford University",
    location: "Oxford, UK",
    deadline: addDays(now, 15).toISOString(),
    postedAt: subDays(now, 3).toISOString(),
    applyLink: "https://ox.ac.uk/scholarships",
    description: "Fully funded scholarship for high-achieving graduate students pursuing research in sustainable energy.",
    tags: ["Research", "Environment", "Education"],
    status: "approved",
    eligibility: "GPA 3.8 or above",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/scholarship-thumbnail-96b8ec91-1773569648613.webp",
    field: "Engineering",
    isRemote: true,
    views: 3200
  },
  {
    id: "4",
    title: "Junior Product Designer",
    category: "Jobs",
    organization: "Figma",
    location: "San Francisco, CA",
    deadline: addDays(now, 1).toISOString(),
    postedAt: subDays(now, 0).toISOString(),
    applyLink: "https://figma.com/careers",
    description: "Help us shape the future of design. We are looking for a creative junior product designer to join our core team.",
    tags: ["Design", "UI/UX", "Startup"],
    status: "approved",
    image: "https://storage.googleapis.com/dala-prod-public-storage/generated-images/018564a2-3c2e-49e4-b8cf-a7247087d862/job-thumbnail-699c4ce6-1773569654370.webp",
    field: "Business",
    isRemote: true,
    views: 450
  }
];
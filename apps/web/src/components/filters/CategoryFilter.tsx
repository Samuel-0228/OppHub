'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryFilter({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = ['All', 'Internships', 'Events', 'Scholarships', 'Competitions', 'Jobs', 'Fellowships', 'Conferences', 'Grants', 'General'];

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== 'All') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative w-full sm:w-48">
      <select
        value={defaultValue || 'All'}
        onChange={(e) => handleCategoryChange(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg transition-all"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
    </div>
  );
}

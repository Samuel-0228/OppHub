'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CategoryFilter({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const categories = ['ALL', 'INTERNSHIPS', 'SCHOLARSHIPS', 'JOBS', 'EVENTS', 'COMPETITIONS', 'FELLOWSHIPS'];

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category && category !== 'ALL') {
      params.set('category', category);
    } else {
      params.delete('category');
    }
    router.push(`?${params.toString()}`);
  };

  const activeCategory = defaultValue?.toUpperCase() || 'ALL';

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleCategoryChange(cat)}
          className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest border border-gray-200 transition-all ${
            activeCategory === cat
              ? 'bg-black text-white border-black'
              : 'bg-white text-black hover:border-black'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

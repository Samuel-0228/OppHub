import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface BlogPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  
  // Assuming blogs are stored in the same table or a separate one.
  // For now, let's assume they are in 'opportunities' with a specific type or a separate 'blogs' table.
  // If 'blogs' table doesn't exist, we'll just show a placeholder.
  
  const { data: blog } = await supabase
    .from('opportunities')
    .select('*')
    .eq('id', slug) // Using ID as slug for now if no slug field
    .single();

  if (!blog) {
    return notFound();
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white pt-24 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-4 block">
            {blog.category}
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-black leading-[0.9] uppercase mb-6">
            {blog.title}
          </h1>
          <p className="text-xl font-bold italic text-gray-500">
            {blog.organization}
          </p>
        </div>
        
        <div className="prose prose-xl max-w-none">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
            {blog.description}
          </p>
        </div>
        
        {blog.apply_link && (
          <div className="mt-12">
            <a 
              href={blog.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-4 bg-black text-white font-black uppercase tracking-tighter hover:bg-orange-600 transition-colors"
            >
              Apply Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

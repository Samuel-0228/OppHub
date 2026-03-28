import { supabase } from '@/lib/supabaseClient';
import { Post } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const { data: blogs } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'approved')
    .eq('category', 'Blog') // Assuming blogs are a category
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col w-full min-h-screen bg-white pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-black leading-[0.85] uppercase mb-16">
          Our <br />
          <span className="text-orange-600 italic">Blogs</span>
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-24">
          {blogs?.map((blog: Post) => (
            <Link key={blog.id} href={`/blogs/${blog.id}`} className="group">
              <div className="border-b-4 border-black pb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600 mb-4 block">
                  {new Date(blog.created_at).toLocaleDateString()}
                </span>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black leading-[0.9] uppercase mb-4 group-hover:text-orange-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-500 line-clamp-3 font-medium">
                  {blog.description}
                </p>
              </div>
            </Link>
          ))}
          {!blogs?.length && (
            <div className="col-span-2 py-20 text-center">
              <p className="text-2xl font-black italic tracking-tighter text-gray-300 uppercase">
                No blogs found.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { supabase } from "@/lib/supabaseClient";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Image from "next/image";

async function getBlogPost(slug: string) {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", slug)
    .single();
  
  if (error || !data) return null;
  return data;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto space-y-8 py-12">
      <div className="space-y-4 text-center">
        <div className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
          {post.category}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
          {post.title}
        </h1>
        <div className="text-gray-500">
          Published on {new Date(post.created_at).toLocaleDateString()}
        </div>
      </div>

      <div className="aspect-video w-full bg-gray-100 rounded-3xl overflow-hidden relative">
        <Image 
          src={`https://picsum.photos/seed/${post.id}/1200/675`} 
          alt={post.title}
          fill
          className="object-cover"
          referrerPolicy="no-referrer"
        />
      </div>

      <div className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed">
        <div className="markdown-body">
          <ReactMarkdown>{post.description}</ReactMarkdown>
        </div>
      </div>

      <div className="pt-12 border-t border-gray-100">
        <div className="bg-blue-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-gray-900">Interested in this opportunity?</h3>
            <p className="text-blue-600/80">Don&apos;t miss out on the deadline!</p>
          </div>
          {post.apply_link && (
            <a 
              href={post.apply_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Apply Now
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

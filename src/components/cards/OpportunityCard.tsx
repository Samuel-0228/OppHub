import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Building2, Calendar, ArrowRight } from 'lucide-react';
import { Post } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface OpportunityCardProps {
  opportunity: Post;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <Link 
      href={opportunity.category === 'Blog' ? `/blogs/${opportunity.id}` : `/opportunities/${opportunity.id}`}
      className="group bg-[#F5F5F5] rounded-none border-none transition-all hover:bg-gray-100 flex flex-col h-full overflow-hidden"
    >
      {opportunity.image_url && (
        <div className="relative w-full aspect-video overflow-hidden">
          <Image 
            src={opportunity.image_url} 
            alt={opportunity.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-6">
        <span className="text-[10px] font-black uppercase tracking-widest text-orange-600">
          {opportunity.category}
        </span>
        <span className="text-gray-300">/</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          {formatDate(opportunity.created_at)}
        </span>
      </div>

      <h3 className="text-2xl font-black tracking-tight text-black mb-6 line-clamp-2 leading-tight uppercase italic group-hover:text-orange-600 transition-colors">
        {opportunity.title}
      </h3>

      <div className="mt-auto space-y-2">
        <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <Building2 className="w-3 h-3 mr-2" />
          {opportunity.organization}
        </div>
        <div className="flex items-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">
          <MapPin className="w-3 h-3 mr-2" />
          {opportunity.location}
        </div>
        {opportunity.deadline && (
          <div className="flex items-center text-[10px] font-bold text-orange-600 uppercase tracking-widest">
            <Calendar className="w-3 h-3 mr-2" />
            {opportunity.deadline}
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center text-[10px] font-black uppercase tracking-widest text-black group-hover:translate-x-2 transition-transform">
        View Details
        <ArrowRight className="ml-2 w-3 h-3" />
      </div>
    </div>
    </Link>
  );
}

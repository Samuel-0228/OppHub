import Link from 'next/link';
import { MapPin, Building2, Calendar, ExternalLink, ArrowRight, Star } from 'lucide-react';
import { Post } from '@/../../packages/types/Post';
import { formatDate } from '@/utils';

interface OpportunityCardProps {
  opportunity: Post;
}

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const isFeatured = opportunity.is_featured;

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl group overflow-hidden ${
      isFeatured ? 'border-blue-200 ring-1 ring-blue-100' : 'border-gray-100'
    }`}>
      {isFeatured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
            <Star className="w-3 h-3 mr-1 fill-current" />
            Featured
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${
            opportunity.category === 'Internships' ? 'bg-blue-50 text-blue-600' :
            opportunity.category === 'Events' ? 'bg-purple-50 text-purple-600' :
            opportunity.category === 'Scholarships' ? 'bg-green-50 text-green-600' :
            'bg-gray-50 text-gray-600'
          }`}>
            {opportunity.category}
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-500 font-medium">
            {formatDate(opportunity.created_at)}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {opportunity.title}
        </h3>

        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
            <span className="font-medium">{opportunity.organization}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{opportunity.location}</span>
          </div>
          {opportunity.deadline && (
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-red-500 font-medium">Deadline: {opportunity.deadline}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-gray-50">
          <Link 
            href={`/opportunities/${opportunity.id}`}
            className="text-sm font-semibold text-gray-900 flex items-center hover:text-blue-600 transition-colors"
          >
            Details
            <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
          
          {opportunity.apply_link && (
            <a 
              href={opportunity.apply_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
            >
              Apply
              <ExternalLink className="ml-2 w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

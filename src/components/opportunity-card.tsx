import React from 'react';
import { Opportunity } from '../types';
import { Card, Badge, Button } from './ui-elements';
import { MapPin, Building2, ExternalLink, Bookmark, Clock, Eye } from 'lucide-react';
import { getDeadlineInfo, getPostedDateLabel, cn } from '../lib/utils';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewDetails: (id: string) => void;
  onBookmark: (id: string) => void;
  isBookmarked?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ 
  opportunity, 
  onViewDetails, 
  onBookmark,
  isBookmarked 
}) => {
  const deadlineInfo = getDeadlineInfo(opportunity.deadline);
  const postedLabel = getPostedDateLabel(opportunity.postedDate);

  return (
    <Card className="flex flex-col h-full group">
      <div className="relative h-48 overflow-hidden">
        {opportunity.imageUrl ? (
          <img 
            src={opportunity.imageUrl} 
            alt={opportunity.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">{opportunity.category}</span>
          </div>
        )}
        
        {postedLabel && (
          <div className={cn("absolute top-3 left-3 px-2 py-1 rounded text-xs font-bold shadow-sm", postedLabel.color)}>
            {postedLabel.label}
          </div>
        )}
        
        {opportunity.isFeatured && (
          <div className="absolute top-3 right-3 bg-amber-400 text-amber-950 px-2 py-1 rounded text-xs font-bold shadow-sm">
            FEATURED
          </div>
        )}

        <button 
          onClick={(e) => { e.stopPropagation(); onBookmark(opportunity.id); }}
          className={cn(
            "absolute bottom-3 right-3 p-2 rounded-full shadow-lg transition-colors",
            isBookmarked ? "bg-indigo-600 text-white" : "bg-white text-gray-400 hover:text-indigo-600"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline" className="text-[10px] uppercase tracking-wider font-bold">
            {opportunity.category}
          </Badge>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Eye className="w-3 h-3" /> {opportunity.views}
          </span>
        </div>

        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-indigo-600 transition-colors">
          {opportunity.title}
        </h3>

        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building2 className="w-4 h-4 text-gray-400" />
            <span className="truncate">{opportunity.organization}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{opportunity.location} {opportunity.remote && '(Remote)'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={cn("px-2 py-0.5 rounded border text-[11px]", deadlineInfo.color)}>
              {deadlineInfo.label}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {opportunity.shortDescription}
        </p>

        <div className="flex items-center gap-2 mt-auto">
          <Button 
            variant="primary" 
            className="w-full gap-2"
            onClick={() => onViewDetails(opportunity.id)}
          >
            View Details
          </Button>
          <Button 
            variant="outline" 
            size="md"
            className="px-2"
            onClick={() => window.open(opportunity.applyLink, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
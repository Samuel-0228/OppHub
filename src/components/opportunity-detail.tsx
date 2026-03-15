import React from 'react';
import { Opportunity } from '../types';
import { Button, Badge } from './ui-elements';
import { 
  Calendar, MapPin, Building2, ArrowLeft, 
  Share2, Bookmark, Send, ExternalLink, 
  Clock, DollarSign, Users, Award 
} from 'lucide-react';
import { getDeadlineInfo, cn } from '../lib/utils';
import { format } from 'date-fns';

interface DetailProps {
  opportunity: Opportunity;
  onBack: () => void;
  onBookmark: (id: string) => void;
  isBookmarked: boolean;
}

export const OpportunityDetail: React.FC<DetailProps> = ({ 
  opportunity, 
  onBack, 
  onBookmark,
  isBookmarked 
}) => {
  const deadlineInfo = getDeadlineInfo(opportunity.deadline);

  const renderTemplate = () => {
    switch (opportunity.category) {
      case 'Internships':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <InfoCard icon={<Clock className="w-5 h-5" />} label="Duration" value={opportunity.duration || 'Not specified'} />
            <InfoCard icon={<Users className="w-5 h-5" />} label="Eligibility" value={opportunity.eligibility || 'All students'} />
          </div>
        );
      case 'Events':
      case 'Conferences':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <InfoCard 
              icon={<Calendar className="w-5 h-5" />} 
              label="Event Date" 
              value={opportunity.eventDate ? format(new Date(opportunity.eventDate), 'PPP') : 'TBD'} 
            />
            <InfoCard icon={<Building2 className="w-5 h-5" />} label="Organizer" value={opportunity.organizer || opportunity.organization} />
          </div>
        );
      case 'Scholarships':
      case 'Grants':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <InfoCard icon={<DollarSign className="w-5 h-5" />} label="Award Amount" value={opportunity.awardAmount || 'Fully Funded'} />
            <InfoCard icon={<Users className="w-5 h-5" />} label="Eligibility" value={opportunity.eligibility || 'Merit-based'} />
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <InfoCard icon={<Award className="w-5 h-5" />} label="Status" value="Accepting Applications" />
            <InfoCard icon={<Users className="w-5 h-5" />} label="Open to" value="General Public" />
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-6 -ml-4 gap-2 text-gray-500 hover:text-indigo-600">
        <ArrowLeft className="w-4 h-4" /> Back to opportunities
      </Button>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="relative h-64 md:h-80 w-full">
          {opportunity.imageUrl ? (
            <img src={opportunity.imageUrl} alt={opportunity.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-4xl font-bold">
              {opportunity.category}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <Badge className="mb-3 bg-white/20 backdrop-blur-md text-white border-white/30">
              {opportunity.category}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">{opportunity.title}</h1>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-8 mb-8">
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Organization</p>
                  <p className="font-semibold text-gray-900">{opportunity.organization}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Location</p>
                  <p className="font-semibold text-gray-900">{opportunity.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Deadline</p>
                  <p className={cn("font-semibold", deadlineInfo.label.includes('Soon') ? 'text-red-600' : 'text-gray-900')}>
                    {format(new Date(opportunity.deadline), 'PPP')}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant={isBookmarked ? 'primary' : 'outline'} 
                onClick={() => onBookmark(opportunity.id)}
                className="gap-2"
              >
                <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
                {isBookmarked ? 'Saved' : 'Save'}
              </Button>
              <Button variant="outline" className="p-2">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="prose prose-indigo max-w-none">
            <h2 className="text-xl font-bold mb-4">About the Opportunity</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>

          {renderTemplate()}

          <div className="mt-12 flex flex-wrap gap-2">
            {opportunity.tags.map(tag => (
              <Badge key={tag} variant="secondary">#{tag}</Badge>
            ))}
          </div>

          <div className="mt-12 p-8 bg-indigo-50 rounded-2xl flex flex-col items-center text-center">
            <h3 className="text-xl font-bold text-indigo-900 mb-2">Ready to apply?</h3>
            <p className="text-indigo-700 mb-6 max-w-md">
              Make sure to check all eligibility criteria before submitting your application.
            </p>
            <Button 
              size="lg" 
              className="w-full sm:w-auto gap-2"
              onClick={() => window.open(opportunity.applyLink, '_blank')}
            >
              Apply via Official Website <ExternalLink className="w-4 h-4" />
            </Button>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-gray-500">
               <Send className="w-4 h-4 text-indigo-600" />
               Join our Telegram channel for real-time updates:
             </div>
             <Button variant="secondary" className="gap-2 bg-sky-50 text-sky-700 hover:bg-sky-100 border-sky-100">
               <Send className="w-4 h-4" /> @OpportunityHub
             </Button>
          </div>
        </div>
      </div>

      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-6">Application Guide</h3>
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <Step number={1} title="Check Eligibility" text="Ensure you meet all the requirements listed by the organization." />
          <Step number={2} title="Prepare Documents" text="Update your CV, prepare a motivation letter, and gather any required certificates." />
          <Step number={3} title="Submit Application" text="Click the official link above and fill out the form before the deadline." />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex items-start gap-4">
    <div className="text-indigo-600 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</p>
      <p className="text-gray-900 font-semibold">{value}</p>
    </div>
  </div>
);

const Step = ({ number, title, text }: { number: number, title: string, text: string }) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
      {number}
    </div>
    <div>
      <h4 className="font-bold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  </div>
);
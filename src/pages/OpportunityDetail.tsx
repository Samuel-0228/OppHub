import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOpportunities } from '../data/mockData';
import { 
  Calendar, MapPin, Building2, ExternalLink, Bookmark, 
  Clock, ArrowLeft, Send, CheckCircle2, Share2, Info 
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const OpportunityDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const opp = mockOpportunities.find(o => o.id === id);

  if (!opp) return <div className="p-20 text-center">Opportunity not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to listings
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-32 h-32 rounded-2xl bg-slate-100 flex items-center justify-center border border-slate-100 flex-shrink-0 overflow-hidden">
              {opp.image ? (
                <img src={opp.image} alt={opp.organization} className="w-full h-full object-cover" />
              ) : (
                <Building2 className="w-12 h-12 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100">
                  {opp.category}
                </span>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                  {opp.field}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">{opp.title}</h1>
              <div className="flex flex-wrap gap-6 text-slate-600 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  {opp.organization}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {opp.location}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  Posted {format(new Date(opp.postedAt), 'MMMM dd, yyyy')}
                </div>
              </div>
            </div>
            <div className="w-full md:w-auto flex flex-col gap-3">
              <button 
                onClick={() => toast.success('Opportunity saved!')}
                className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm"
              >
                <Bookmark className="w-4 h-4" />
                Save Opportunity
              </button>
              <a 
                href={opp.applyLink}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
              >
                Apply Now
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-indigo-600" />
                Description
              </h2>
              <div className="text-slate-600 leading-relaxed">
                <p className="mb-4">{opp.description}</p>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-600/20 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <Send className="w-8 h-8 text-white" />
                <h3 className="text-xl font-bold">Never Miss a Post</h3>
              </div>
              <p className="text-indigo-100 mb-8 leading-relaxed">
                Join our Telegram channel to get this and thousands of other opportunities instantly as they are posted.
              </p>
              <a 
                href="https://t.me/yourchannel"
                className="block w-full text-center bg-white text-indigo-600 font-bold py-4 rounded-2xl hover:bg-indigo-50 transition-all shadow-lg shadow-white/10"
              >
                Join Telegram Channel
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
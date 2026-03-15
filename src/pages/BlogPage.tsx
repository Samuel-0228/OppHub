import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockOpportunities } from '../data/mockData';
import { ArrowLeft, Clock, Facebook, Twitter, Linkedin, Send, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

export const BlogPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const opp = mockOpportunities.find(o => o.id === id) || mockOpportunities[0];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to feed
        </Link>

        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm font-bold text-indigo-600 mb-6">
            <span className="bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider text-[10px]">Career Guide</span>
            <span className="flex items-center gap-1 text-slate-400">
              <Clock className="w-4 h-4" />
              6 min read
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-[1.1]">
            How to Apply for the {opp.title} at {opp.organization}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center font-bold text-white">
              OT
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">OpporTunix Editorial</p>
              <p className="text-xs text-slate-400 font-medium">Published on {format(new Date(opp.postedAt), 'MMMM dd, yyyy')}</p>
            </div>
          </div>
        </header>

        <div className="aspect-video w-full rounded-3xl overflow-hidden mb-12 border border-slate-100">
          <img 
            src={opp.image || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4'} 
            alt={opp.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_250px] gap-16">
          <article className="prose prose-lg prose-slate max-w-none">
            <p className="text-xl text-slate-600 leading-relaxed font-medium mb-8">
              The {opp.title} is one of the most sought-after opportunities in the field. This guide provides everything you need to know about the application process, eligibility, and tips for success.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">1. Overview of the Program</h2>
            <p className="text-slate-600 mb-6">
              Hosted by {opp.organization}, this program aims to foster innovation and provide participants with hands-on experience in {opp.tags.join(', ')}. 
              Located in {opp.location}, it offers a unique environment for professional growth.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">2. Eligibility Requirements</h2>
            <p className="text-slate-600 mb-6">To be considered for the {opp.title}, applicants should generally meet the following criteria:</p>
            <ul className="list-disc ml-6 space-y-2 text-slate-600 mb-6">
              <li>Strong background or interest in {opp.field}.</li>
              <li>{opp.eligibility || 'Specific requirements vary by position and department.'}</li>
              <li>Excellent communication and collaborative skills.</li>
              <li>Available for the duration of the program.</li>
            </ul>

            <div className="my-12 p-8 bg-slate-900 rounded-3xl text-white">
              <h3 className="text-xl font-bold mb-4">Important Deadlines</h3>
              <p className="text-slate-400 mb-6">Make sure to submit your application before the final cutoff.</p>
              <div className="flex items-center gap-4 border-l-4 border-indigo-500 pl-6">
                <div>
                  <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Application Deadline</p>
                  <p className="text-2xl font-bold">{format(new Date(opp.deadline), 'MMMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
          </article>

          <aside className="space-y-12">
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Share Article</h4>
              <div className="flex flex-col gap-3">
                <button className="flex items-center gap-3 text-slate-500 hover:text-blue-600 font-bold text-sm transition-colors">
                  <Facebook className="w-4 h-4" /> Facebook
                </button>
                <button className="flex items-center gap-3 text-slate-500 hover:text-blue-400 font-bold text-sm transition-colors">
                  <Twitter className="w-4 h-4" /> Twitter
                </button>
                <button className="flex items-center gap-3 text-slate-500 hover:text-blue-700 font-bold text-sm transition-colors">
                  <Linkedin className="w-4 h-4" /> LinkedIn
                </button>
                <button className="flex items-center gap-3 text-slate-500 hover:text-indigo-600 font-bold text-sm transition-colors">
                  <Send className="w-4 h-4" /> Telegram
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">Stay Updated</h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-6">
                Join our Telegram community of 50,000+ members.
              </p>
              <a 
                href="#"
                className="flex items-center justify-center gap-2 w-full bg-slate-900 text-white py-3 rounded-2xl text-xs font-bold hover:bg-slate-800 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                Join Group
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { 
  BarChart3, Settings, Search, 
  CheckCircle, Edit3, Pin, Trash2, 
  CheckCircle2, AlertCircle 
} from 'lucide-react';
import { mockOpportunities } from '../data/mockData';
import { Opportunity } from '../types';
import { format } from 'date-fns';
import { toast } from 'sonner';

export const Admin: React.FC = () => {
  const [items, setItems] = useState<Opportunity[]>(mockOpportunities);

  const stats = [
    { label: 'Total Imported', value: '1,284', icon: BarChart3, color: 'text-blue-600' },
    { label: 'Pending Approval', value: '42', icon: AlertCircle, color: 'text-amber-600' },
    { label: 'Live Opportunities', value: '856', icon: CheckCircle2, color: 'text-emerald-600' },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium">Manage and review auto-imported opportunities.</p>
          </div>
          <button className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-semibold mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl w-full md:w-96 border border-slate-100">
              <Search className="w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search database..." className="bg-transparent border-none focus:ring-0 text-sm w-full" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-50">
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Opportunity</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900 line-clamp-1">{item.title}</p>
                        <p className="text-xs text-slate-500 font-medium">{item.organization}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full">{item.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toast.success('Approved')} className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg"><CheckCircle className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => toast.error('Deleted')} className="p-2 text-slate-400 hover:text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
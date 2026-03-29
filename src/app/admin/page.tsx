'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  Trash2, 
  AlertCircle,
  Settings,
  Database,
  ExternalLink,
  Loader2,
  Zap
} from 'lucide-react';
import { Post } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
  const [opps, setOpps] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [testing, setTesting] = useState(false);
  const [botToken, setBotToken] = useState('');
  const [chatId, setChatId] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingWebhook, setSettingWebhook] = useState(false);
  const [health, setHealth] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  const handleTestBot = async () => {
    if (!botToken || !chatId) return alert('Please enter Bot Token and Chat ID');
    setTesting(true);
    try {
      const res = await fetch('/api/test-bot', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ botToken, chatId })
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Test message sent successfully! Check your Telegram channel/chat.');
      } else {
        throw new Error(data.error || 'Test failed');
      }
    } catch (err: any) {
      alert(`❌ Bot Test Failed: ${err.message}`);
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('admin_token');
    if (!storedToken) {
      router.push('/login');
      return;
    }
    setToken(storedToken);
  }, [router]);

  const checkHealth = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/health', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setHealth(data);
      }
    } catch (err) {
      console.error('Health check failed');
    }
  }, [token]);

  const fetchOpps = useCallback(async () => {
    try {
      const res = await fetch('/api/opportunities?status=all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      setOpps(result.data || result || []);
    } catch (err) {
      console.error('Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.telegram_bot_token) setBotToken(data.telegram_bot_token);
      if (data.telegram_chat_id) setChatId(data.telegram_chat_id);
    } catch (err) {
      console.error('Failed to fetch settings');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchOpps();
      fetchSettings();
      checkHealth();
    }
  }, [token, fetchOpps, fetchSettings, checkHealth]);

  const saveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ telegram_bot_token: botToken, telegram_chat_id: chatId })
      });
      if (res.ok) {
        alert('Settings saved! Automatic sync is active.');
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleSetWebhook = async () => {
    if (!botToken) return alert('Please enter Bot Token');
    setSettingWebhook(true);
    try {
      const res = await fetch('/api/telegram/webhook/set', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ botToken })
      });
      const data = await res.json();
      if (res.ok) {
        alert('✅ Webhook set successfully! Your website will now update automatically.');
      } else {
        throw new Error(data.error || 'Failed to set webhook');
      }
    } catch (err: any) {
      alert(`❌ Webhook Setup Failed: ${err.message}`);
    } finally {
      setSettingWebhook(false);
    }
  };

  const handleSync = async () => {
    if (!botToken || !chatId) return alert('Please enter Bot Token and Chat ID');
    setSyncing(true);
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ botToken, chatId })
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Imported ${data.importedCount} new opportunities!`);
        fetchOpps();
      } else {
        throw new Error(data.error || 'Sync failed');
      }
    } catch (err: any) {
      alert(err.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const approveOpp = async (id: string) => {
    try {
      const res = await fetch(`/api/opportunities/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchOpps();
    } catch (err) {
      console.error('Failed to approve');
    }
  };

  const deleteOpp = async (id: string) => {
    if (!confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) fetchOpps();
    } catch (err) {
      console.error('Failed to delete');
    }
  };

  if (!token) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <LayoutDashboard size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('admin_token');
                router.push('/');
                router.refresh();
              }}
              className="text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-widest px-3 py-1 border border-red-100 rounded-lg hover:bg-red-50 transition-all w-fit"
            >
              Logout
            </button>
          </div>
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <Clock size={14} />
            System polls Telegram every 5 minutes automatically.
          </p>
          
          {health && health.supabase && (!health.supabase.opportunities_table || !health.supabase.settings_table) && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-red-600 uppercase tracking-wider">Supabase Setup Incomplete</p>
                <p className="text-xs text-red-500 mt-1">
                  {!health.supabase.opportunities_table && "• 'opportunities' table missing. "}
                  {!health.supabase.settings_table && "• 'settings' table missing. "}
                </p>
                <p className="text-xs text-red-400 mt-1 italic">Please check your Supabase database schema.</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full lg:w-auto bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
            <Settings size={16} className="text-blue-600" />
            Telegram Sync Configuration
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Bot Token</label>
              <input 
                type="password" 
                placeholder="Enter Bot Token" 
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-gray-400 tracking-wider">Channel ID</label>
              <input 
                type="text" 
                placeholder="e.g. -1001234567890" 
                className="w-full px-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
              />
              <p className="text-[9px] text-gray-400 italic">Must start with -100 for channels</p>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button 
              onClick={saveSettings}
              disabled={savingSettings}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-[10px] font-bold rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {savingSettings ? <Loader2 className="animate-spin w-3 h-3" /> : <Database size={12} />}
              Save
            </button>
            <button 
              onClick={handleTestBot}
              disabled={testing}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 text-[10px] font-bold rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {testing ? <Loader2 className="animate-spin w-3 h-3" /> : <Zap size={12} />}
              Test
            </button>
            <button 
              onClick={handleSetWebhook}
              disabled={settingWebhook}
              className="flex-1 px-4 py-2 border border-orange-600 text-orange-600 text-[10px] font-bold rounded-lg hover:bg-orange-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {settingWebhook ? <Loader2 className="animate-spin w-3 h-3" /> : <Settings size={12} />}
              Set Webhook
            </button>
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 text-[10px] font-bold rounded-lg hover:bg-blue-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {syncing ? <RefreshCw className="animate-spin w-3 h-3" /> : <RefreshCw size={12} />}
              Sync
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Status</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Opportunity</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">Views</th>
                <th className="py-4 px-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="py-8 px-6 h-16 bg-gray-50/50" />
                  </tr>
                ))
              ) : opps.length > 0 ? (
                opps.map(opp => (
                  <tr key={opp.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <span className={cn(
                        "text-[10px] font-bold uppercase px-2.5 py-1 rounded-full",
                        opp.status === "approved" ? "bg-green-100 text-green-700" : 
                        opp.status === "pending" ? "bg-yellow-100 text-yellow-700" : 
                        "bg-red-100 text-red-700"
                      )}>
                        {opp.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 max-w-md">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 line-clamp-1">{opp.title}</span>
                        <span className="text-xs text-gray-500 italic">{opp.organization}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                        {opp.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-xs font-mono text-gray-400">{opp.view_count}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {opp.status === "pending" && (
                          <button 
                            onClick={() => approveOpp(opp.id)} 
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => deleteOpp(opp.id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <p className="text-gray-400 font-medium">No opportunities found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

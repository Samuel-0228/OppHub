import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Filter, 
  Calendar, 
  MapPin, 
  ExternalLink, 
  ArrowRight, 
  Menu, 
  X, 
  ChevronRight,
  Clock,
  Tag,
  Bookmark,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Trash2,
  CheckCircle,
  Pin,
  Star,
  Send
} from "lucide-react";
import { cn, formatDate, getDeadlineStatus } from "./lib/utils";
import ReactMarkdown from "react-markdown";

// --- Types ---
interface Opportunity {
  id: number;
  telegram_id: string;
  title: string;
  type: string;
  organization: string;
  location: string;
  deadline: string;
  apply_link: string;
  description: string;
  category: string;
  tags: string; // JSON string
  status: string;
  is_pinned: number;
  is_featured: number;
  created_at: string;
  view_count: number;
}

// --- Components ---

const Navbar = ({ isAdmin }: { isAdmin: boolean }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    window.location.href = "/";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tighter uppercase italic">OppHub</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-orange-600 transition-colors">Home</Link>
            <Link to="/categories" className="text-sm font-medium hover:text-orange-600 transition-colors">Categories</Link>
            <Link to="/digest" className="text-sm font-medium hover:text-orange-600 transition-colors">Weekly Digest</Link>
            {isAdmin ? (
              <>
                <Link to="/admin" className="flex items-center space-x-1 text-sm font-bold text-orange-600">
                  <LayoutDashboard size={16} />
                  <span>Admin</span>
                </Link>
                <button onClick={handleLogout} className="text-sm font-medium text-gray-500 hover:text-red-600">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <Link to="/login" className="text-sm font-medium text-gray-500 hover:text-black">Admin Login</Link>
            )}
            <a 
              href="https://t.me/your_channel" 
              target="_blank" 
              className="px-5 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-orange-600 transition-all rounded-full flex items-center space-x-2"
            >
              <Send size={14} />
              <span>Join Telegram</span>
            </a>
          </div>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-black/5 px-4 py-6 space-y-4"
          >
            <Link to="/" className="block text-lg font-bold" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/categories" className="block text-lg font-bold" onClick={() => setIsOpen(false)}>Categories</Link>
            <Link to="/digest" className="block text-lg font-bold" onClick={() => setIsOpen(false)}>Weekly Digest</Link>
            {isAdmin && <Link to="/admin" className="block text-lg font-bold text-orange-600" onClick={() => setIsOpen(false)}>Admin Panel</Link>}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const OpportunityCard = ({ opp }: { opp: Opportunity }) => {
  const status = getDeadlineStatus(opp.deadline);
  const tags = JSON.parse(opp.tags || "[]");

  return (
    <motion.div 
      layout
      className="group relative bg-white border border-black/5 p-6 hover:border-black transition-all duration-300 flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-2 py-1 rounded">
          {opp.category}
        </span>
        {status && (
          <span className={cn(
            "text-[10px] font-bold uppercase px-2 py-1 rounded-full",
            status === "soon" && "bg-red-100 text-red-600",
            status === "this-week" && "bg-yellow-100 text-yellow-700",
            status === "fresh" && "bg-green-100 text-green-600",
            status === "expired" && "bg-gray-100 text-gray-500"
          )}>
            {status === "soon" ? "Closing Soon" : status === "this-week" ? "Closing This Week" : status === "fresh" ? "New" : "Expired"}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold leading-tight mb-2 group-hover:text-orange-600 transition-colors">
        {opp.title}
      </h3>
      
      <p className="text-sm text-gray-500 font-medium mb-4 flex items-center">
        <span className="italic">{opp.organization}</span>
        <span className="mx-2 opacity-20">|</span>
        <span className="flex items-center"><MapPin size={12} className="mr-1" /> {opp.location}</span>
      </p>

      <p className="text-sm text-gray-600 line-clamp-3 mb-6 flex-grow">
        {opp.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {tags.slice(0, 3).map((tag: string) => (
          <span key={tag} className="text-[10px] font-mono text-gray-400">#{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-black/5 mt-auto">
        <div className="flex items-center text-xs font-bold text-gray-400">
          <Calendar size={14} className="mr-1" />
          {formatDate(opp.deadline)}
        </div>
        <Link 
          to={`/opportunity/${opp.id}`}
          className="flex items-center text-xs font-black uppercase tracking-widest group-hover:translate-x-1 transition-transform"
        >
          Details <ChevronRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
};

// --- Pages ---

const HomePage = () => {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/opportunities")
      .then(res => res.json())
      .then(data => {
        setOpps(data);
        setLoading(false);
      });
  }, []);

  const filteredOpps = useMemo(() => {
    return opps.filter(o => {
      const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase()) || 
                           o.organization.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === "All" || o.category === filter;
      return matchesSearch && matchesFilter;
    });
  }, [opps, search, filter]);

  const categories = ["All", "Internships", "Scholarships", "Jobs", "Events", "Competitions", "Fellowships"];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="mb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] uppercase mb-8"
        >
          Find Your <br />
          <span className="text-orange-600 italic">Next Big</span> <br />
          Opportunity.
        </motion.h1>
        
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="relative flex-grow max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search by title, company, or keywords..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-black focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all font-bold"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-4 py-2 text-[10px] font-black uppercase tracking-widest border border-black/10 transition-all",
                  filter === cat ? "bg-black text-white border-black" : "hover:bg-gray-50"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-80 bg-gray-100 animate-pulse border border-black/5" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOpps.map(opp => (
            <OpportunityCard key={opp.id} opp={opp} />
          ))}
        </div>
      )}

      {!loading && filteredOpps.length === 0 && (
        <div className="text-center py-20 border-2 border-dashed border-black/10">
          <p className="text-xl font-bold text-gray-400 italic">No opportunities found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

const OpportunityDetail = () => {
  const { id } = useParams();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/opportunities/${id}`)
      .then(res => res.json())
      .then(data => {
        setOpp(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse h-screen bg-gray-50" />;
  if (!opp) return <div className="text-center py-20">Not found</div>;

  const tags = JSON.parse(opp.tags || "[]");

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest mb-12 hover:text-orange-600">
        <ChevronRight size={14} className="rotate-180 mr-2" /> Back to list
      </Link>

      <div className="mb-12">
        <div className="flex items-center space-x-4 mb-6">
          <span className="px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest">
            {opp.category}
          </span>
          <span className="text-sm font-mono text-gray-400">ID: {opp.telegram_id || "LOCAL"}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
          {opp.title}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 border-y border-black/5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Organization</p>
            <p className="font-bold text-xl">{opp.organization}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Location</p>
            <p className="font-bold text-xl flex items-center"><MapPin size={18} className="mr-2" /> {opp.location}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">Deadline</p>
            <p className="font-bold text-xl flex items-center"><Clock size={18} className="mr-2" /> {formatDate(opp.deadline)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="prose prose-orange max-w-none">
            <h2 className="text-2xl font-black uppercase tracking-tight mb-4">Description</h2>
            <div className="text-lg leading-relaxed text-gray-700 whitespace-pre-wrap">
              {opp.description}
            </div>
          </div>

          <div className="mt-12 pt-12 border-t border-black/5">
            <h3 className="text-sm font-black uppercase tracking-widest mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-orange-50 p-8 border border-orange-100 sticky top-32">
            <h3 className="text-xl font-black uppercase tracking-tight mb-4">Ready to apply?</h3>
            <p className="text-sm text-orange-800/70 mb-8">
              Make sure to check the eligibility criteria on the official website before submitting your application.
            </p>
            <a 
              href={opp.apply_link} 
              target="_blank" 
              className="w-full py-4 bg-orange-600 text-white font-black uppercase tracking-widest flex items-center justify-center hover:bg-black transition-all group"
            >
              Apply Now <ExternalLink size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <div className="mt-8 pt-8 border-t border-orange-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-orange-800/50 mb-2">Share</p>
              <div className="flex space-x-4">
                <button className="text-orange-600 hover:text-black transition-colors"><Send size={20} /></button>
                <button className="text-orange-600 hover:text-black transition-colors"><Bookmark size={20} /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminLogin = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("admin_token", data.token);
      window.location.href = "/admin";
    } else {
      setError("Invalid password");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-32">
      <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-8">Admin Access</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border-2 border-black focus:outline-none focus:ring-4 focus:ring-orange-100 font-bold"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-600 text-xs font-bold">{error}</p>}
          <button className="w-full py-4 bg-black text-white font-black uppercase tracking-widest hover:bg-orange-600 transition-all">
            Unlock Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [botToken, setBotToken] = useState("");
  const [chatId, setChatId] = useState("");
  const token = localStorage.getItem("admin_token");

  useEffect(() => {
    if (!token) window.location.href = "/login";
    fetchOpps();
  }, [token]);

  const fetchOpps = () => {
    fetch("/api/opportunities?status=all", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOpps(data);
        setLoading(false);
      });
  };

  const handleSync = async () => {
    if (!botToken || !chatId) return alert("Please enter Bot Token and Chat ID");
    setSyncing(true);
    try {
      const res = await fetch("/api/sync", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ botToken, chatId })
      });
      const data = await res.json();
      alert(`Imported ${data.importedCount} new opportunities!`);
      fetchOpps();
    } catch (err) {
      alert("Sync failed");
    } finally {
      setSyncing(false);
    }
  };

  const approveOpp = async (id: number) => {
    await fetch(`/api/opportunities/${id}/approve`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOpps();
  };

  const deleteOpp = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    await fetch(`/api/opportunities/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOpps();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 border border-black/5 rounded-lg w-full md:w-auto">
          <input 
            type="text" 
            placeholder="Bot Token" 
            className="px-3 py-2 text-xs border border-black/10 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={botToken}
            onChange={(e) => setBotToken(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Channel ID" 
            className="px-3 py-2 text-xs border border-black/10 focus:outline-none focus:ring-2 focus:ring-orange-200"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
          />
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="px-6 py-2 bg-black text-white text-[10px] font-black uppercase tracking-widest flex items-center space-x-2 disabled:opacity-50"
          >
            {syncing ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}
            <span>Sync Telegram</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-black text-left">
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest">Status</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest">Opportunity</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest">Category</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest">Views</th>
              <th className="py-4 px-4 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opps.map(opp => (
              <tr key={opp.id} className="border-b border-black/5 hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4">
                  <span className={cn(
                    "text-[10px] font-bold uppercase px-2 py-1 rounded",
                    opp.status === "approved" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  )}>
                    {opp.status}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <p className="font-bold text-sm">{opp.title}</p>
                  <p className="text-xs text-gray-400 italic">{opp.organization}</p>
                </td>
                <td className="py-4 px-4 text-xs font-medium text-gray-500">{opp.category}</td>
                <td className="py-4 px-4 text-xs font-mono text-gray-400">{opp.view_count}</td>
                <td className="py-4 px-4 text-right space-x-2">
                  {opp.status === "pending" && (
                    <button onClick={() => approveOpp(opp.id)} className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors">
                      <CheckCircle size={18} />
                    </button>
                  )}
                  <button onClick={() => deleteOpp(opp.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function App() {
  const isAdmin = !!localStorage.getItem("admin_token");

  return (
    <Router>
      <div className="min-h-screen bg-white text-black font-sans selection:bg-orange-200">
        <Navbar isAdmin={isAdmin} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/opportunity/:id" element={<OpportunityDetail />} />
            <Route path="/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/categories" element={<div className="py-20 text-center font-black text-4xl uppercase italic">Coming Soon</div>} />
            <Route path="/digest" element={<div className="py-20 text-center font-black text-4xl uppercase italic">Weekly Digest Coming Soon</div>} />
          </Routes>
        </main>
        
        <footer className="bg-black text-white py-20 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <span className="text-3xl font-black italic tracking-tighter uppercase mb-6 block">OppHub</span>
              <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                The most advanced automated platform for finding internships, scholarships, and professional opportunities.
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-orange-600">Explore</h4>
              <ul className="space-y-4 text-sm font-bold">
                <li><Link to="/" className="hover:text-orange-600">Browse All</Link></li>
                <li><Link to="/categories" className="hover:text-orange-600">Categories</Link></li>
                <li><Link to="/digest" className="hover:text-orange-600">Weekly Digest</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-orange-600">Community</h4>
              <p className="text-sm text-gray-400 mb-6 italic">Join 10,000+ students and professionals on our Telegram channel.</p>
              <a 
                href="https://t.me/your_channel" 
                className="inline-flex items-center space-x-2 text-sm font-black uppercase tracking-widest hover:text-orange-600"
              >
                <span>Join Telegram</span> <ArrowRight size={16} />
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">© 2026 Opportunity Hub. All rights reserved.</p>
            <div className="flex space-x-8 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

import React, { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase';
import { collection, query, onSnapshot, doc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { Opportunity, UserProfile } from '../types';
import { Check, X, Trash2, ExternalLink, Star, LayoutDashboard, BarChart3, Radio, PanelLeftClose, ArrowUpDown, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { subDays, format, startOfDay, addDays } from 'date-fns';

interface Props {
  user: UserProfile | null;
}

type SortKey = 'createdAt' | 'title' | 'category' | 'views' | 'status';
type FilterStatus = 'all' | 'approved' | 'pending';

export const Admin: React.FC<Props> = ({ user }) => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'posts' | 'channels'>('overview');
  const [tableSearch, setTableSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const q = query(collection(db, 'opportunities'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setOpportunities(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Opportunity)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleApprove = (id: string, status: boolean) => {
    updateDoc(doc(db, 'opportunities', id), { isApproved: status });
  };

  const handleFeature = (id: string, status: boolean) => {
    updateDoc(doc(db, 'opportunities', id), { isFeatured: status });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this opportunity?')) {
      deleteDoc(doc(db, 'opportunities', id));
    }
  };

  const totalViews = useMemo(() => opportunities.reduce((s, o) => s + (o.viewCount || 0), 0), [opportunities]);

  const stats = useMemo(() => {
    const weekAgo = subDays(new Date(), 7);
    const postsThisWeek = opportunities.filter((o) => new Date(o.createdAt) >= weekAgo).length;
    const channelSet = new Set(opportunities.map((o) => o.sourceChannel?.trim()).filter(Boolean));
    const activeChannels = channelSet.size > 0 ? channelSet.size : 1;
    const avgViews = opportunities.length ? totalViews / opportunities.length : 0;
    const engagementRate = opportunities.length ? Math.min(100, Math.round((avgViews / 75) * 100)) : 0;

    return {
      totalPosts: opportunities.length,
      activeChannels,
      postsThisWeek,
      engagementRate,
      pending: opportunities.filter((o) => !o.isApproved).length,
    };
  }, [opportunities, totalViews]);

  const chartBars = useMemo(() => {
    const days = 14;
    const start = startOfDay(subDays(new Date(), days - 1));
    return Array.from({ length: days }, (_, i) => {
      const d = addDays(start, i);
      const key = format(d, 'yyyy-MM-dd');
      const count = opportunities.filter((o) => format(new Date(o.createdAt), 'yyyy-MM-dd') === key).length;
      return { label: format(d, 'MMM d'), count, key };
    });
  }, [opportunities]);

  const maxBar = Math.max(...chartBars.map((b) => b.count), 1);

  const channelRows = useMemo(() => {
    const map = new Map<string, { count: number; views: number; last: string }>();
    for (const o of opportunities) {
      const name = o.sourceChannel?.trim() || 'Telegram';
      const cur = map.get(name) || { count: 0, views: 0, last: o.createdAt };
      map.set(name, {
        count: cur.count + 1,
        views: cur.views + (o.viewCount || 0),
        last: new Date(o.createdAt) > new Date(cur.last) ? o.createdAt : cur.last,
      });
    }
    return Array.from(map.entries())
      .map(([name, data]) => ({
        name,
        ...data,
        health: data.count >= 3 ? 'strong' : data.count >= 1 ? 'steady' : 'low',
      }))
      .sort((a, b) => b.count - a.count);
  }, [opportunities]);

  const filteredRows = useMemo(() => {
    let rows = [...opportunities];
    if (filterStatus === 'approved') rows = rows.filter((o) => o.isApproved);
    if (filterStatus === 'pending') rows = rows.filter((o) => !o.isApproved);
    const q = tableSearch.trim().toLowerCase();
    if (q) {
      rows = rows.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q) ||
          (o.sourceChannel || '').toLowerCase().includes(q) ||
          (o.organization || '').toLowerCase().includes(q)
      );
    }
    rows.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'createdAt') cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      else if (sortKey === 'title') cmp = a.title.localeCompare(b.title);
      else if (sortKey === 'category') cmp = a.category.localeCompare(b.category);
      else if (sortKey === 'views') cmp = (a.viewCount || 0) - (b.viewCount || 0);
      else if (sortKey === 'status') cmp = Number(a.isApproved) - Number(b.isApproved);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return rows;
  }, [opportunities, filterStatus, tableSearch, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir(key === 'title' || key === 'category' ? 'asc' : 'desc');
    }
  };

  const scrollTo = (id: 'overview' | 'posts' | 'channels') => {
    setActiveSection(id);
    setSidebarOpen(false);
    document.getElementById(`admin-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (user?.role !== 'admin') {
    return (
      <div className="oh-page-fade max-w-lg mx-auto px-5 py-28 text-center">
        <div className="oh-card p-10 !transform-none hover:!transform-none">
          <h1 className="text-2xl font-bold text-[var(--oh-text)] mb-3" style={{ fontFamily: 'var(--oh-font-display)' }}>
            Restricted area
          </h1>
          <p className="text-[var(--oh-text-muted)]">You don&apos;t have access to the admin dashboard.</p>
        </div>
      </div>
    );
  }

  const navItem = (id: typeof activeSection, label: string, icon: React.ElementType) => {
    const Icon = icon;
    const active = activeSection === id;
    return (
      <button
        type="button"
        onClick={() => scrollTo(id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-[var(--oh-radius)] text-sm font-semibold transition-all duration-[var(--oh-transition)] border ${
          active
            ? 'bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)] border-[var(--oh-border-strong)]'
            : 'text-[var(--oh-text-muted)] border-transparent hover:bg-[var(--oh-elevated)] hover:text-[var(--oh-text)]'
        }`}
      >
        <Icon className="w-4 h-4 shrink-0" />
        {label}
      </button>
    );
  };

  return (
    <div className="oh-page-fade flex min-h-[calc(100vh-5rem)]">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <aside
        className={`fixed lg:sticky top-[4.25rem] z-50 lg:z-0 h-[calc(100vh-4.25rem)] w-[min(17rem,85vw)] border-r border-[var(--oh-border)] bg-[var(--oh-surface)] flex flex-col transition-transform duration-[var(--oh-transition)] lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-5 border-b border-[var(--oh-border)] flex items-center justify-between lg:block">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--oh-text-subtle)] mb-3 hidden lg:block">Navigate</p>
          <button
            type="button"
            className="lg:hidden p-2 rounded-[var(--oh-radius)] border border-[var(--oh-border)] text-[var(--oh-text-muted)]"
            onClick={() => setSidebarOpen(false)}
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItem('overview', 'Overview', LayoutDashboard)}
          {navItem('posts', 'Posts & moderation', BarChart3)}
          {navItem('channels', 'Channel health', Radio)}
        </nav>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-5 py-4 border-b border-[var(--oh-border)] bg-[var(--oh-canvas)]">
          <span className="text-sm font-bold text-[var(--oh-text)]" style={{ fontFamily: 'var(--oh-font-display)' }}>
            Admin
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2.5 rounded-[var(--oh-radius)] border border-[var(--oh-border)] bg-[var(--oh-surface)] text-[var(--oh-text)]"
          >
            <PanelLeftClose className="w-5 h-5 rotate-180" />
          </button>
        </div>

        <div className="max-w-6xl mx-auto px-5 py-8 md:py-12 space-y-16">
          <header id="admin-overview" className="scroll-mt-28">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--oh-accent-bright)] mb-3">Control center</p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--oh-text)]" style={{ fontFamily: 'var(--oh-font-display)' }}>
                  Analytics &amp; ops
                </h1>
                <p className="text-[var(--oh-text-muted)] mt-2 max-w-xl">
                  Live pulse on ingestion, publishing velocity, and channel performance.
                </p>
              </div>
              {!loading && (
                <div className="flex gap-3 text-xs font-bold uppercase tracking-widest">
                  <span className="px-3 py-1.5 rounded-full bg-[var(--oh-warning-dim)] text-[var(--oh-warning)] border border-[var(--oh-border)]">
                    {stats.pending} pending
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { label: 'Total posts', value: stats.totalPosts, hint: 'All time' },
                { label: 'Active channels', value: stats.activeChannels, hint: 'Distinct sources' },
                { label: 'Posts this week', value: stats.postsThisWeek, hint: 'Last 7 days' },
                { label: 'Engagement rate', value: `${stats.engagementRate}%`, hint: 'Views-based index' },
              ].map((card) => (
                <div
                  key={card.label}
                  className="oh-card p-6 !transform-none hover:!translate-y-0 hover:border-[var(--oh-border)] bg-[var(--oh-elevated)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--oh-text-subtle)] mb-2">{card.label}</p>
                  <p className="text-3xl font-extrabold text-[var(--oh-text)] tabular-nums" style={{ fontFamily: 'var(--oh-font-display)' }}>
                    {card.value}
                  </p>
                  <p className="text-xs text-[var(--oh-text-muted)] mt-2">{card.hint}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 oh-card p-6 md:p-8 !transform-none hover:!translate-y-0">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-lg font-bold text-[var(--oh-text)]" style={{ fontFamily: 'var(--oh-font-display)' }}>
                  Posts over time
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--oh-text-subtle)]">Last 14 days</span>
              </div>
              <div className="flex items-end gap-1.5 sm:gap-2 h-44">
                {chartBars.map((b) => (
                  <div key={b.key} className="flex-1 flex flex-col items-center gap-2 min-w-0 group">
                    <div className="relative w-full flex flex-col justify-end h-36 bg-[var(--oh-surface)] rounded-t-md border border-[var(--oh-border)] overflow-hidden">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(b.count / maxBar) * 100}%` }}
                        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
                        className="oh-chart-bar w-full mt-auto min-h-[4px]"
                        title={`${b.count} posts`}
                      />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-semibold text-[var(--oh-text-subtle)] truncate max-w-full">{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section id="admin-posts" className="scroll-mt-28 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--oh-text)]" style={{ fontFamily: 'var(--oh-font-display)' }}>
                  Recent posts
                </h2>
                <p className="text-sm text-[var(--oh-text-muted)] mt-1">Sort, filter, and moderate the Firestore queue</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 min-w-[12rem]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--oh-text-subtle)]" />
                  <input
                    type="search"
                    placeholder="Filter table…"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-[var(--oh-radius)] bg-[var(--oh-surface)] border border-[var(--oh-border)] text-sm text-[var(--oh-text)] placeholder:text-[var(--oh-text-subtle)] focus:outline-none focus:border-[var(--oh-border-strong)]"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="px-4 py-2.5 rounded-[var(--oh-radius)] bg-[var(--oh-surface)] border border-[var(--oh-border)] text-sm font-semibold text-[var(--oh-text)]"
                >
                  <option value="all">All statuses</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            <div className="oh-table-wrap">
              <table className="oh-table">
                <thead>
                  <tr>
                    {(
                      [
                        ['title', 'Opportunity'],
                        ['category', 'Category'],
                        ['status', 'Status'],
                        ['views', 'Views'],
                        ['createdAt', 'Created'],
                      ] as const
                    ).map(([key, label]) => (
                      <th key={key}>
                        <button
                          type="button"
                          onClick={() => toggleSort(key as SortKey)}
                          className="inline-flex items-center gap-1.5 text-inherit hover:text-[var(--oh-accent-bright)] transition-colors"
                        >
                          {label}
                          <ArrowUpDown className="w-3 h-3 opacity-60 shrink-0" />
                        </button>
                      </th>
                    ))}
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-[var(--oh-text-muted)]">
                          Loading…
                        </td>
                      </tr>
                    ) : filteredRows.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-16 text-center text-[var(--oh-text-muted)]">
                          No rows match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredRows.map((o) => (
                        <motion.tr
                          key={o.id}
                          layout
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                        >
                          <td>
                            <div className="font-bold text-[var(--oh-text)] max-w-[220px] sm:max-w-xs">{o.title}</div>
                            <div className="text-[11px] text-[var(--oh-text-subtle)] mt-1 uppercase tracking-wide">{o.organization || '—'}</div>
                          </td>
                          <td>
                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)] border border-[var(--oh-border)]">
                              {o.category}
                            </span>
                          </td>
                          <td>
                            {o.isApproved ? (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--oh-success)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--oh-success)] shadow-[0_0_8px_var(--oh-success)]" />
                                Live
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--oh-warning)]">
                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--oh-warning)]" />
                                Review
                              </span>
                            )}
                          </td>
                          <td className="tabular-nums text-[var(--oh-text-muted)]">{o.viewCount ?? 0}</td>
                          <td className="text-sm text-[var(--oh-text-muted)] tabular-nums whitespace-nowrap">
                            {format(new Date(o.createdAt), 'MMM d, yyyy')}
                          </td>
                          <td className="text-right">
                            <div className="inline-flex items-center justify-end gap-1 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleApprove(o.id, !o.isApproved)}
                                className={`p-2 rounded-[var(--oh-radius)] transition-colors ${
                                  o.isApproved
                                    ? 'bg-[var(--oh-warning-dim)] text-[var(--oh-warning)] hover:opacity-90'
                                    : 'bg-[var(--oh-success-dim)] text-[var(--oh-success)] hover:opacity-90'
                                }`}
                                title={o.isApproved ? 'Unpublish' : 'Approve'}
                              >
                                {o.isApproved ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFeature(o.id, !o.isFeatured)}
                                className={`p-2 rounded-[var(--oh-radius)] transition-colors ${
                                  o.isFeatured
                                    ? 'bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)] border border-[var(--oh-border-strong)]'
                                    : 'bg-[var(--oh-surface)] text-[var(--oh-text-muted)] border border-[var(--oh-border)]'
                                }`}
                                title={o.isFeatured ? 'Unfeature' : 'Feature'}
                              >
                                <Star className={`w-4 h-4 ${o.isFeatured ? 'fill-current' : ''}`} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(o.id)}
                                className="p-2 rounded-[var(--oh-radius)] bg-[var(--oh-danger-dim)] text-[var(--oh-danger)] hover:opacity-90"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              {o.applyLink && (
                                <a
                                  href={o.applyLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-[var(--oh-radius)] bg-[var(--oh-surface)] text-[var(--oh-text-muted)] border border-[var(--oh-border)] hover:text-[var(--oh-accent-bright)]"
                                  title="Open link"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </section>

          <section id="admin-channels" className="scroll-mt-28 pb-12 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[var(--oh-text)]" style={{ fontFamily: 'var(--oh-font-display)' }}>
                Channel health
              </h2>
              <p className="text-sm text-[var(--oh-text-muted)] mt-1">Volume and visibility by source label</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {channelRows.map((row) => (
                <div
                  key={row.name}
                  className="oh-card p-6 !transform-none hover:-translate-y-0.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <p className="text-sm font-bold text-[var(--oh-text)] flex items-center gap-2">
                      <Radio className="w-4 h-4 text-[var(--oh-accent)]" />
                      {row.name}
                    </p>
                    <p className="text-xs text-[var(--oh-text-muted)] mt-1">
                      Last post {format(new Date(row.last), 'MMM d, yyyy')} · {row.views} total views
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-2xl font-extrabold text-[var(--oh-text)] tabular-nums" style={{ fontFamily: 'var(--oh-font-display)' }}>
                        {row.count}
                      </p>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-[var(--oh-text-subtle)]">Posts</p>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                        row.health === 'strong'
                          ? 'bg-[var(--oh-success-dim)] text-[var(--oh-success)] border-[var(--oh-border)]'
                          : row.health === 'steady'
                            ? 'bg-[var(--oh-accent-dim)] text-[var(--oh-accent-bright)] border-[var(--oh-border)]'
                            : 'bg-[var(--oh-surface)] text-[var(--oh-text-subtle)] border-[var(--oh-border)]'
                      }`}
                    >
                      {row.health}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

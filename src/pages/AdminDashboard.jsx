import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiHome, HiDocumentText, HiBookOpen, HiUsers, HiChartBar, HiPlus, HiEye, HiPencil, HiTrash,
  HiMenu, HiX, HiCurrencyDollar, HiShoppingBag, HiViewGrid
} from 'react-icons/hi';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import { formatDate, formatNumber, formatPrice, getCategoryLabel } from '../utils/format';

// Encre de la plateforme pour les graphiques (une seule série par graphique)
const INK = '#111827';
const GRID = '#e5e7eb';
const AXIS = '#6b7280';
const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const SIDEBAR_ITEMS = [
  { id: 'dashboard', name: '𞤃𞤢𞤧𞤦𞤮𞤪𞤣', icon: HiViewGrid },
  { id: 'statistics', name: '𞤅𞤼𞤢𞤼𞤭𞤧𞤼𞤭𞤳', icon: HiChartBar },
  { id: 'articles', name: '𞤃𞤢𞤦𞤢𞤤𞤫', icon: HiDocumentText },
  { id: 'ebooks', name: '𞤃𞤫𞤧𞤫', icon: HiBookOpen },
  { id: 'users', name: '𞤖𞤮𞤪𞤦𞤫', icon: HiUsers }
];

// Infobulle sobre commune aux graphiques
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="mt-0.5 text-gray-600">{formatNumber(payload[0].value)}</p>
    </div>
  );
};

const StatTile = ({ label, value, detail, icon: Icon }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">{value}</p>
        {detail && <p className="mt-1 text-xs text-gray-500">{detail}</p>}
      </div>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
        {Icon && <Icon className="h-5 w-5 text-gray-900" aria-hidden="true" />}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, subtitle, children, empty }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5">
    <h3 className="font-semibold text-gray-900">{title}</h3>
    {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
    <div className="mt-4">
      {empty ? <p className="py-16 text-center text-sm text-gray-400">Aucune donnée pour le moment</p> : children}
    </div>
  </div>
);

// Largeur mesurée du conteneur (ResponsiveContainer de Recharts restait à 0 px ici)
const ChartFrame = ({ height, children }) => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.floor(entry.contentRect.width)));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} style={{ height }}>{width > 0 && children(width)}</div>;
};

// Barres fines (≤ 24 px), extrémité arrondie de 4 px, grille fine et discrète
const ColumnChart = ({ data, dataKey, nameKey }) => (
  <ChartFrame height={260}>{(width) => (
    <BarChart width={width} height={260} data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
      <CartesianGrid vertical={false} stroke={GRID} />
      <XAxis dataKey={nameKey} tickLine={false} axisLine={{ stroke: GRID }} tick={{ fill: AXIS, fontSize: 12 }} minTickGap={12} />
      <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 12 }} />
      <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
      <Bar dataKey={dataKey} fill={INK} radius={[4, 4, 0, 0]} maxBarSize={24} />
    </BarChart>
  )}</ChartFrame>
);

const RankingChart = ({ data, dataKey, nameKey }) => {
  const height = data.length * 44 + 8;
  return (
  <ChartFrame height={height}>{(width) => (
    <BarChart width={width} height={height} data={data} layout="vertical" margin={{ top: 0, right: 40, bottom: 0, left: 0 }}>
      <XAxis type="number" hide allowDecimals={false} domain={[0, 'dataMax']} />
      <YAxis type="category" dataKey={nameKey} width={130} tickLine={false} axisLine={false} tick={{ fill: '#374151', fontSize: 12 }} />
      <Tooltip content={<ChartTooltip />} cursor={{ fill: '#f3f4f6' }} />
      <Bar dataKey={dataKey} fill={INK} radius={[0, 4, 4, 0]} maxBarSize={24}>
        <LabelList dataKey={dataKey} position="right" formatter={formatNumber} style={{ fill: '#374151', fontSize: 12 }} />
      </Bar>
    </BarChart>
  )}</ChartFrame>
  );
};

const iconAction = 'inline-flex h-9 w-9 min-h-0 min-w-0 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900';
const th = 'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 sm:px-6';
const td = 'px-4 py-4 text-sm sm:px-6';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [allArticles, setAllArticles] = useState([]);
  const [allEbooks, setAllEbooks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, tone = 'success') => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 2500);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [articlesRes, ebooksRes, usersRes, statsRes] = await Promise.all([
        apiService.articles.getAll({ limit: 100 }),
        apiService.ebooks.getAll({ limit: 100 }),
        apiService.admin.getUsers({ limit: 100 }),
        apiService.admin.getStats()
      ]);
      setAllArticles(articlesRes.data.data?.articles || []);
      setAllEbooks(ebooksRes.data.data?.ebooks || []);
      setAllUsers(usersRes.data.data?.users || []);
      setTotalRevenue(statsRes.data.data?.stats?.totalRevenue || 0);
    } catch {
      notify('Impossible de charger les données', 'error');
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchData();
  }, [user, navigate, fetchData]);

  const handleTogglePublish = async (id, currentStatus) => {
    try {
      await apiService.articles.togglePublished(id);
      setAllArticles(prev => prev.map(a => (a._id === id ? { ...a, status: currentStatus === 'published' ? 'draft' : 'published' } : a)));
      notify(currentStatus === 'published' ? 'Article repassé en brouillon' : 'Article publié');
    } catch {
      notify('Action impossible', 'error');
    }
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Supprimer définitivement cet article ?')) return;
    try {
      await apiService.articles.delete(id);
      setAllArticles(prev => prev.filter(a => a._id !== id));
      notify('Article supprimé');
    } catch {
      notify('Suppression impossible', 'error');
    }
  };

  const handleDeleteEbook = async (id) => {
    if (!window.confirm('Supprimer définitivement cet e-book ?')) return;
    try {
      await apiService.ebooks.delete(id);
      setAllEbooks(prev => prev.filter(e => e._id !== id));
      notify('E-book supprimé');
    } catch {
      notify('Suppression impossible', 'error');
    }
  };

  const handleUpdateUserRole = async (id, newRole) => {
    try {
      await apiService.admin.updateUser(id, { role: newRole });
      setAllUsers(prev => prev.map(u => (u._id === id ? { ...u, role: newRole } : u)));
      notify('Rôle mis à jour');
    } catch {
      notify('Mise à jour impossible', 'error');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Supprimer cet utilisateur ?')) return;
    try {
      await apiService.admin.deleteUser(id);
      setAllUsers(prev => prev.filter(u => u._id !== id));
      notify('Utilisateur supprimé');
    } catch {
      notify('Suppression impossible', 'error');
    }
  };

  // Données réelles uniquement
  const publishedArticles = allArticles.filter(a => a.status === 'published').length;
  const publishedEbooks = allEbooks.filter(e => e.status === 'published').length;
  const totalSales = allEbooks.reduce((sum, e) => sum + (e.sales || 0), 0);
  const currentYear = new Date().getFullYear();
  const monthly = MONTHS.slice(0, new Date().getMonth() + 1).map((month, idx) => {
    const inMonth = (item) => {
      const d = new Date(item.publishedAt || item.createdAt);
      return d.getFullYear() === currentYear && d.getMonth() === idx;
    };
    return { month, publications: allArticles.filter(inMonth).length + allEbooks.filter(inMonth).length };
  });
  const byCategory = Object.entries(
    allEbooks.reduce((acc, e) => ({ ...acc, [e.category]: (acc[e.category] || 0) + 1 }), {})
  ).map(([category, count]) => ({ name: getCategoryLabel(category), count })).sort((a, b) => b.count - a.count);
  const topSellers = allEbooks
    .filter(e => e.sales > 0)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 6)
    .map(e => ({ name: e.title.length > 18 ? `${e.title.slice(0, 17)}…` : e.title, sales: e.sales }));

  const activeItem = SIDEBAR_ITEMS.find(i => i.id === activeTab);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-gray-300 border-t-black" aria-label="Chargement" />
      </div>
    );
  }

  const tableCard = (children) => (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="overflow-x-auto">
        <table className="table w-full min-w-[640px]">{children}</table>
      </div>
    </div>
  );

  const newButton = (to, label) => (
    <Link
      to={to}
      className="inline-flex min-h-0 items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800"
    >
      <HiPlus className="h-4 w-4" aria-hidden="true" />
      {label}
    </Link>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      {/* Barre latérale */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-black text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <Link to="/" className="text-2xl font-bold tracking-tight">𞤀𞤣𞤤𞤢𞤥</Link>
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-white/80">𞤀𞤣𞤥𞤭𞤲</span>
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3">
          {SIDEBAR_ITEMS.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
                aria-current={active ? 'page' : undefined}
                className={`flex w-full min-h-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                  active ? 'bg-white text-black' : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{item.name}</span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link to="/" className="flex min-h-0 items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white">
            <HiHome className="h-5 w-5" aria-hidden="true" />
            𞤪𞤵𞤼𞤢𞤲 𞤫 𞤀𞤧𞤵𞤤
          </Link>
          <div className="mt-2 flex items-center gap-3 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-white/50">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Contenu */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex items-center gap-3 border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
          <button type="button" onClick={() => setSidebarOpen(true)} className={`${iconAction} lg:hidden`} aria-label="Ouvrir le menu">
            <HiMenu className="h-6 w-6" />
          </button>
          <h1 className="flex-1 text-xl font-bold text-gray-900 sm:text-2xl">{activeItem?.name}</h1>
          {activeTab === 'articles' && newButton('/admin/articles/new', '𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮')}
          {activeTab === 'ebooks' && newButton('/admin/ebooks/new', '𞤃𞤫𞤧𞤮 𞤑𞤫𞤧𞤮')}
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatTile label="𞤃𞤢𞤦𞤢𞤤𞤫" value={formatNumber(allArticles.length)} detail={`𞤅𞤢𞤪𞤭𞤲𞤣𞤫 : ${formatNumber(publishedArticles)}`} icon={HiDocumentText} />
                <StatTile label="𞤃𞤫𞤧𞤫" value={formatNumber(allEbooks.length)} detail={`𞤅𞤢𞤪𞤭𞤲𞤣𞤫 : ${formatNumber(publishedEbooks)}`} icon={HiBookOpen} />
                <StatTile label="𞤖𞤮𞤪𞤦𞤫" value={formatNumber(allUsers.length)} detail={`Admins : ${formatNumber(allUsers.filter(u => u.role === 'admin').length)}`} icon={HiUsers} />
                <StatTile label="Revenus" value={totalRevenue ? formatPrice(totalRevenue) : formatNumber(0)} detail={`𞤜𞤫𞤲𞤼𞤫𞤧 : ${formatNumber(totalSales)}`} icon={HiCurrencyDollar} />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between px-5 py-4">
                    <h2 className="font-semibold text-gray-900">𞤃𞤢𞤦𞤢𞤤𞤫</h2>
                    <button type="button" onClick={() => setActiveTab('articles')} className="min-h-0 text-sm font-medium text-gray-500 hover:text-gray-900">Tout voir</button>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {allArticles.slice(0, 5).map(a => (
                      <li key={a._id} className="flex items-center justify-between gap-4 px-5 py-3">
                        <span className="truncate text-sm text-gray-900">{a.title}</span>
                        <span className="shrink-0 text-xs text-gray-500">{formatDate(a.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                  <div className="flex items-center justify-between px-5 py-4">
                    <h2 className="font-semibold text-gray-900">𞤃𞤫𞤧𞤫</h2>
                    <button type="button" onClick={() => setActiveTab('ebooks')} className="min-h-0 text-sm font-medium text-gray-500 hover:text-gray-900">Tout voir</button>
                  </div>
                  <ul className="divide-y divide-gray-100">
                    {allEbooks.slice(0, 5).map(e => (
                      <li key={e._id} className="flex items-center justify-between gap-4 px-5 py-3">
                        <span className="truncate text-sm text-gray-900">{e.title}</span>
                        <span className="shrink-0 text-xs font-medium text-gray-700">{formatPrice(e.price)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <StatTile label="𞤜𞤫𞤲𞤼𞤫𞤧" value={formatNumber(totalSales)} detail="E-books vendus" icon={HiShoppingBag} />
                <StatTile label="Revenus" value={totalRevenue ? formatPrice(totalRevenue) : formatNumber(0)} detail="Total encaissé" icon={HiCurrencyDollar} />
                <StatTile label="Vues" value={formatNumber(allArticles.reduce((s, a) => s + (a.views || 0), 0) + allEbooks.reduce((s, e) => s + (e.views || 0), 0))} detail="Articles et e-books" icon={HiEye} />
              </div>
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <ChartCard title="Publications par mois" subtitle={`Articles et e-books publiés en ${currentYear}`} empty={!monthly.some(m => m.publications)}>
                  <ColumnChart data={monthly} dataKey="publications" nameKey="month" />
                </ChartCard>
                <ChartCard title="E-books par catégorie" empty={!byCategory.length}>
                  <RankingChart data={byCategory} dataKey="count" nameKey="name" />
                </ChartCard>
                <ChartCard title="Meilleures ventes" subtitle="Nombre d'exemplaires vendus" empty={!topSellers.length}>
                  <RankingChart data={topSellers} dataKey="sales" nameKey="name" />
                </ChartCard>
              </div>
            </div>
          )}

          {activeTab === 'articles' && tableCard(
            <>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr><th className={th}>𞤚𞤢𞤦𞤭</th><th className={th}>𞤅𞤼𞤢𞤼𞤵𞤧</th><th className={th}>𞤚𞤢𞤪𞤭𞤸</th><th className={`${th} text-right`}>𞤀𞤳𞤧𞤢𞤲</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allArticles.map(article => (
                  <tr key={article._id} className="transition-colors hover:bg-gray-50">
                    <td className={`${td} font-medium text-gray-900`}>{article.title}</td>
                    <td className={td}>
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(article._id, article.status)}
                        title="Changer le statut"
                        className={`min-h-0 rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                          article.status === 'published' ? 'bg-black text-white hover:bg-gray-800' : 'border border-gray-300 text-gray-600 hover:border-gray-900'
                        }`}
                      >
                        {article.status === 'published' ? '𞤅𞤢𞤪𞤭𞤲𞤣𞤫' : '𞤄𞤪𞤢𞤬𞤺'}
                      </button>
                    </td>
                    <td className={`${td} text-gray-500`}>{formatDate(article.createdAt)}</td>
                    <td className={`${td} text-right`}>
                      <div className="inline-flex gap-1">
                        <Link to={`/articles/${article.slug}`} target="_blank" className={iconAction} aria-label="Voir"><HiEye className="h-5 w-5" /></Link>
                        <Link to={`/admin/articles/edit/${article._id}`} className={iconAction} aria-label="Modifier"><HiPencil className="h-5 w-5" /></Link>
                        <button type="button" onClick={() => handleDeleteArticle(article._id)} className={`${iconAction} hover:bg-red-50 hover:text-red-600`} aria-label="Supprimer"><HiTrash className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}

          {activeTab === 'ebooks' && tableCard(
            <>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr><th className={th}>𞤚𞤢𞤦𞤭</th><th className={th}>𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤</th><th className={th}>𞤅𞤢𞤪𞤭</th><th className={th}>𞤜𞤫𞤲𞤼𞤫𞤧</th><th className={th}>𞤚𞤢𞤪𞤭𞤸</th><th className={`${th} text-right`}>𞤀𞤳𞤧𞤢𞤲</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allEbooks.map(ebook => (
                  <tr key={ebook._id} className="transition-colors hover:bg-gray-50">
                    <td className={`${td} font-medium text-gray-900`}>{ebook.title}</td>
                    <td className={`${td} text-gray-600`}>{ebook.author}</td>
                    <td className={`${td} font-semibold text-gray-900`}>{formatPrice(ebook.price)}</td>
                    <td className={`${td} text-gray-600`}>{formatNumber(ebook.sales)}</td>
                    <td className={`${td} text-gray-500`}>{formatDate(ebook.createdAt)}</td>
                    <td className={`${td} text-right`}>
                      <div className="inline-flex gap-1">
                        <Link to={`/ebooks/${ebook.slug}`} target="_blank" className={iconAction} aria-label="Voir"><HiEye className="h-5 w-5" /></Link>
                        <Link to={`/admin/ebooks/edit/${ebook._id}`} className={iconAction} aria-label="Modifier"><HiPencil className="h-5 w-5" /></Link>
                        <button type="button" onClick={() => handleDeleteEbook(ebook._id)} className={`${iconAction} hover:bg-red-50 hover:text-red-600`} aria-label="Supprimer"><HiTrash className="h-5 w-5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </>
          )}

          {activeTab === 'users' && tableCard(
            <>
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr><th className={th}>Nom</th><th className={th}>Email</th><th className={th}>Rôle</th><th className={th}>Inscription</th><th className={`${th} text-right`}>Actions</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {allUsers.map(member => {
                  const isSelf = member._id === user?.id || member._id === user?._id;
                  return (
                    <tr key={member._id} className="transition-colors hover:bg-gray-50">
                      <td className={`${td} font-medium text-gray-900`}>
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                            {member.name?.charAt(0).toUpperCase()}
                          </div>
                          {member.name}
                        </div>
                      </td>
                      <td className={`${td} text-gray-600`}>{member.email}</td>
                      <td className={td}>
                        <select
                          value={member.role}
                          onChange={(e) => handleUpdateUserRole(member._id, e.target.value)}
                          disabled={isSelf}
                          aria-label={`Rôle de ${member.name}`}
                          className={`min-h-0 rounded-full border px-3 py-1 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-gray-900/20 disabled:cursor-not-allowed ${
                            member.role === 'admin' ? 'border-black bg-black text-white' : 'border-gray-300 bg-white text-gray-700'
                          }`}
                        >
                          <option value="user">Utilisateur</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className={`${td} text-gray-500`}>{formatDate(member.createdAt)}</td>
                      <td className={`${td} text-right`}>
                        {!isSelf && (
                          <button type="button" onClick={() => handleDeleteUser(member._id)} className={`${iconAction} hover:bg-red-50 hover:text-red-600`} aria-label="Supprimer">
                            <HiTrash className="h-5 w-5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </>
          )}
        </main>
      </div>

      {/* Bouton de fermeture du menu mobile */}
      {sidebarOpen && (
        <button type="button" onClick={() => setSidebarOpen(false)} className="fixed right-4 top-4 z-50 flex h-10 w-10 min-h-0 items-center justify-center rounded-full bg-white shadow-lg lg:hidden" aria-label="Fermer le menu">
          <HiX className="h-5 w-5" />
        </button>
      )}

      {toast && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-50 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg auth-enter ${toast.tone === 'error' ? 'bg-red-600' : 'bg-gray-900'}`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiHome, HiDocumentText, HiBookOpen, HiUsers, HiChartBar, HiPlus, HiEye, HiPencil, HiTrash, HiMenu, HiX, HiShieldCheck } from 'react-icons/hi';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({ articles: { total: 0, published: 0 }, ebooks: { total: 0, published: 0 }, users: { total: 0 } });
  const [allArticles, setAllArticles] = useState([]);
  const [allEbooks, setAllEbooks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { navigate('/'); return; }
    fetchData();
  }, [user, navigate]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [articlesRes, ebooksRes, usersRes] = await Promise.all([apiService.articles.getAll({ limit: 100 }), apiService.ebooks.getAll({ limit: 100 }), apiService.admin.getUsers({ limit: 100 })]);
      const articlesData = articlesRes.data.data?.articles || articlesRes.data.articles || [];
      const ebooksData = ebooksRes.data.data?.ebooks || ebooksRes.data.ebooks || [];
      const usersData = usersRes.data.data?.users || usersRes.data.users || [];
      setAllArticles(articlesData);
      setAllEbooks(ebooksData);
      setAllUsers(usersData);
      setStats({ articles: { total: articlesData.length, published: articlesData.filter(a => a.status === 'published').length }, ebooks: { total: ebooksData.length, published: ebooksData.filter(e => e.status === 'published').length }, users: { total: usersData.length } });
    } catch (error) { console.error(error); } finally { setLoading(false); }
  }, []);

  const handleTogglePublish = useCallback(async (id, currentStatus) => {
    try {
      await apiService.articles.togglePublished(id);
      setAllArticles(prev => prev.map(a => a._id === id ? { ...a, status: currentStatus === 'published' ? 'draft' : 'published' } : a));
      alert(currentStatus === 'published' ? '𞤃𞤢𞤦𞤢𞤤 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤫 𞤄𞤪𞤢𞤬𞤺' : '𞤃𞤢𞤦𞤢𞤤 𞤥𞤢𞤪𞤭𞤲𞤣𞤫');
    } catch (error) { alert('𞤖𞤢𞤤𞤢'); }
  }, []);

  const handleDeleteArticle = useCallback(async (id) => {
    if (window.confirm('𞤀 𞤴𞤮𞤲𞤢𞤲 𞤸𞤢𞤤𞤢𞤲?')) {
      try { await apiService.articles.delete(id); setAllArticles(prev => prev.filter(a => a._id !== id)); alert('𞤸𞤢𞤤𞤢𞤲𞤣𞤫'); } catch { alert('𞤖𞤢𞤤𞤢'); }
    }
  }, []);

  const handleDeleteEbook = useCallback(async (id) => {
    if (window.confirm('𞤀 𞤴𞤮𞤲𞤢𞤲 𞤸𞤢𞤤𞤢𞤲?')) {
      try { await apiService.ebooks.delete(id); setAllEbooks(prev => prev.filter(e => e._id !== id)); alert('𞤸𞤢𞤤𞤢𞤲𞤣𞤫'); } catch { alert('𞤖𞤢𞤤𞤢'); }
    }
  }, []);

  const handleUpdateUserRole = useCallback(async (id, newRole) => {
    try {
      await apiService.admin.updateUser(id, { role: newRole });
      setAllUsers(prev => prev.map(u => u._id === id ? { ...u, role: newRole } : u));
      alert('Rôle mis à jour');
    } catch { alert('Erreur'); }
  }, []);

  const handleDeleteUser = useCallback(async (id) => {
    if (window.confirm('Supprimer cet utilisateur?')) {
      try { await apiService.admin.deleteUser(id); setAllUsers(prev => prev.filter(u => u._id !== id)); alert('Utilisateur supprimé'); } catch { alert('Erreur'); }
    }
  }, []);

  const getMonthlyData = () => {
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentMonth = new Date().getMonth();
    return months.slice(0, currentMonth + 1).map((month, idx) => {
      const articlesCount = allArticles.filter(a => new Date(a.createdAt).getMonth() === idx).length;
      const ebooksCount = allEbooks.filter(e => new Date(e.createdAt).getMonth() === idx).length;
      return { month, articles: articlesCount, ebooks: ebooksCount, ventes: Math.floor(Math.random() * 50) + 10 };
    });
  };

  const getCategoryData = () => {
    const categories = {};
    allEbooks.forEach(e => { categories[e.category] = (categories[e.category] || 0) + 1; });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  };

  const sidebarItems = [
    { id: 'home', name: '𞤪𞤵𞤼𞤢𞤲 𞤫 𞤀𞤧𞤵𞤤', icon: HiHome, isLink: true, href: '/' },
    { id: 'dashboard', name: '𞤃𞤢𞤧𞤦𞤮𞤪𞤣', icon: HiChartBar },
    { id: 'statistics', name: '𞤅𞤼𞤢𞤼𞤭𞤧𞤼𞤭𞤳', icon: HiChartBar },
    { id: 'articles', name: '𞤃𞤢𞤦𞤢𞤤𞤫', icon: HiDocumentText },
    { id: 'ebooks', name: '𞤃𞤫𞤧𞤫', icon: HiBookOpen },
    { id: 'users', name: '𞤖𞤮𞤪𞤦𞤫', icon: HiUsers }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444', '#06B6D4'];

  if (loading) return (<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"><div className="text-center"><div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div><p className="text-gray-700 font-medium">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p></div></div>);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <div className="lg:hidden fixed top-4 left-4 z-50"><button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all">{sidebarOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}</button></div>
      {sidebarOpen && <div className="lg:hidden fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-30" onClick={() => setSidebarOpen(false)} />}
      <div className={`fixed lg:static inset-y-0 left-0 z-40 lg:w-72 w-72 bg-white shadow-2xl transform transition-all duration-300 flex flex-col h-screen ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 bg-gradient-to-r from-blue-600 to-indigo-600 flex-shrink-0"><h2 className="text-2xl font-bold text-white flex items-center" dir="rtl"><span className="text-3xl mr-3">⚙️</span> 𞤀𞤣𞤥𞤭𞤲</h2></div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">{sidebarItems.map((item) => (item.isLink ? (<Link key={item.id} to={item.href} onClick={() => setSidebarOpen(false)} className="flex items-center px-4 py-3 mb-1 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-xl transition-all group" dir="rtl"><item.icon className="h-5 w-5 ml-3 text-gray-500 group-hover:text-blue-600" /><span className="font-medium">{item.name}</span></Link>) : (<button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center px-4 py-3 mb-1 rounded-xl transition-all ${activeTab === item.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg' : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50'} group`} dir="rtl"><item.icon className={`h-5 w-5 ml-3 ${activeTab === item.id ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'}`} /><span className="font-medium">{item.name}</span></button>)))}</nav>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (<div><h1 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent" dir="rtl">𞤃𞤢𞤧𞤦𞤮𞤪𞤣</h1><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"><div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"><div className="flex items-center justify-between"><div><p className="text-blue-100 text-sm font-medium" dir="rtl">𞤃𞤢𞤦𞤢𞤤𞤫</p><p className="text-4xl font-bold text-white mt-2">{stats.articles.total}</p><p className="text-blue-100 text-xs mt-2">𞤅𞤢𞤪𞤭𞤲𞤣𞤫: {stats.articles.published}</p></div><HiDocumentText className="h-16 w-16 text-blue-200 opacity-50" /></div></div><div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"><div className="flex items-center justify-between"><div><p className="text-green-100 text-sm font-medium" dir="rtl">𞤃𞤫𞤧𞤫</p><p className="text-4xl font-bold text-white mt-2">{stats.ebooks.total}</p><p className="text-green-100 text-xs mt-2">𞤅𞤢𞤪𞤭𞤲𞤣𞤫: {stats.ebooks.published}</p></div><HiBookOpen className="h-16 w-16 text-green-200 opacity-50" /></div></div><div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"><div className="flex items-center justify-between"><div><p className="text-purple-100 text-sm font-medium" dir="rtl">𞤖𞤮𞤪𞤦𞤫</p><p className="text-4xl font-bold text-white mt-2">{stats.users.total}</p><p className="text-purple-100 text-xs mt-2">𞤀𞤳𞤼𞤭𞤬</p></div><HiUsers className="h-16 w-16 text-purple-200 opacity-50" /></div></div></div></div>)}
          {activeTab === 'statistics' && (<div><h1 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent" dir="rtl">𞤅𞤼𞤢𞤼𞤭𞤧𞤼𞤭𞤳 & 𞤜𞤫𞤲𞤼𞤫𞤧</h1><div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><div className="bg-white p-6 rounded-2xl shadow-xl"><h3 className="text-lg font-bold mb-4 text-gray-800" dir="rtl">𞤜𞤫𞤲𞤼𞤫𞤧 𞤸𞤭𞤼𞤢𞤲𞤣𞤫</h3><ResponsiveContainer width="100%" height={300}><BarChart data={getMonthlyData()}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Bar dataKey="ventes" fill="#3B82F6" name="Ventes" /><Bar dataKey="ebooks" fill="#10B981" name="E-books" /></BarChart></ResponsiveContainer></div><div className="bg-white p-6 rounded-2xl shadow-xl"><h3 className="text-lg font-bold mb-4 text-gray-800" dir="rtl">𞤀𞤣𞤢𞤣𞤮 𞤃𞤫𞤧𞤫 & 𞤃𞤢𞤦𞤢𞤤𞤫</h3><ResponsiveContainer width="100%" height={300}><LineChart data={getMonthlyData()}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="articles" stroke="#3B82F6" strokeWidth={2} name="Articles" /><Line type="monotone" dataKey="ebooks" stroke="#10B981" strokeWidth={2} name="E-books" /></LineChart></ResponsiveContainer></div><div className="bg-white p-6 rounded-2xl shadow-xl"><h3 className="text-lg font-bold mb-4 text-gray-800" dir="rtl">𞤃𞤫𞤧𞤫 𞤸𞤭𞤼𞤢𞤲𞤣𞤫 𞤳𞤢𞤼𞤫𞤺𞤮𞤪𞤭</h3><ResponsiveContainer width="100%" height={300}><PieChart><Pie data={getCategoryData()} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={80} fill="#8884d8" dataKey="value">{getCategoryData().map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div><div className="bg-white p-6 rounded-2xl shadow-xl"><h3 className="text-lg font-bold mb-4 text-gray-800" dir="rtl">𞤅𞤼𞤢𞤼𞤭𞤧𞤼𞤭𞤳 𞤜𞤫𞤲𞤼𞤫</h3><div className="space-y-4"><div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl"><span className="font-medium text-gray-700">Total Ventes</span><span className="text-2xl font-bold text-blue-600">{getMonthlyData().reduce((acc, m) => acc + m.ventes, 0)}</span></div><div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl"><span className="font-medium text-gray-700">E-books Vendus</span><span className="text-2xl font-bold text-green-600">{stats.ebooks.published}</span></div><div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl"><span className="font-medium text-gray-700">Revenu Estimé</span><span className="text-2xl font-bold text-purple-600">{(getMonthlyData().reduce((acc, m) => acc + m.ventes, 0) * 5000).toLocaleString()} GNF</span></div></div></div></div></div>)}
          {activeTab === 'articles' && (<div><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" dir="rtl"><h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">𞤃𞤢𞤦𞤢𞤤𞤫</h1><Link to="/admin/articles/new" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-medium"><HiPlus className="h-5 w-5 ml-2" />𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮</Link></div><div className="bg-white rounded-2xl shadow-xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gradient-to-r from-gray-50 to-gray-100"><tr><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤚𞤢𞤦𞤭</th><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤅𞤼𞤢𞤼𞤵𞤧</th><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤚𞤢𞤪𞤭𞤸</th><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤀𞤳𞤧𞤢𞤲</th></tr></thead><tbody className="divide-y divide-gray-100">{allArticles.map((article) => (<tr key={article._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-colors"><td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900" dir="rtl">{article.title}</td><td className="px-4 sm:px-6 py-4"><button onClick={() => handleTogglePublish(article._id, article.status)} className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all hover:scale-105 ${article.status === 'published' ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md'}`}>{article.status === 'published' ? '𞤅𞤢𞤪𞤭𞤲𞤣𞤫' : '𞤄𞤪𞤢𞤬𞤺'}</button></td><td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{new Date(article.createdAt).toLocaleDateString()}</td><td className="px-4 sm:px-6 py-4"><div className="flex space-x-2"><Link to={`/articles/${article.slug}`} target="_blank" className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><HiEye className="h-5 w-5" /></Link><Link to={`/admin/articles/edit/${article._id}`} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"><HiPencil className="h-5 w-5" /></Link><button onClick={() => handleDeleteArticle(article._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><HiTrash className="h-5 w-5" /></button></div></td></tr>))}</tbody></table></div></div></div>)}
          {activeTab === 'ebooks' && (<div><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" dir="rtl"><h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">𞤃𞤫𞤧𞤫</h1><Link to="/admin/ebooks/new" className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 font-medium"><HiPlus className="h-5 w-5 ml-2" />𞤃𞤫𞤧𞤮 𞤑𞤫𞤧𞤮</Link></div><div className="bg-white rounded-2xl shadow-xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gradient-to-r from-gray-50 to-gray-100"><tr><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤚𞤢𞤦𞤭</th><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤</th><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤅𞤢𞤪𞤭</th><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤚𞤢𞤪𞤭𞤸</th><th className="px-4 sm:px-6 py-4 text-right text-xs sm:text-sm font-semibold text-gray-700">𞤀𞤳𞤧𞤢𞤲</th></tr></thead><tbody className="divide-y divide-gray-100">{allEbooks.map((ebook) => (<tr key={ebook._id} className="hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-colors"><td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900" dir="rtl">{ebook.title}</td><td className="px-4 sm:px-6 py-4 text-sm text-gray-700" dir="rtl">{ebook.author}</td><td className="px-4 sm:px-6 py-4 text-sm font-bold text-green-600">{ebook.price?.toLocaleString()} GNF</td><td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{new Date(ebook.createdAt).toLocaleDateString()}</td><td className="px-4 sm:px-6 py-4"><div className="flex space-x-2"><Link to={`/ebooks/${ebook.slug}`} target="_blank" className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><HiEye className="h-5 w-5" /></Link><Link to={`/admin/ebooks/edit/${ebook._id}`} className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"><HiPencil className="h-5 w-5" /></Link><button onClick={() => handleDeleteEbook(ebook._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><HiTrash className="h-5 w-5" /></button></div></td></tr>))}</tbody></table></div></div></div>)}
          {activeTab === 'users' && (<div><div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4" dir="rtl"><h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">𞤖𞤮𞤪𞤦𞤫</h1></div><div className="bg-white rounded-2xl shadow-xl overflow-hidden"><div className="overflow-x-auto"><table className="w-full"><thead className="bg-gradient-to-r from-gray-50 to-gray-100"><tr><th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Nom</th><th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Email</th><th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Rôle</th><th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Date</th><th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-gray-700">Actions</th></tr></thead><tbody className="divide-y divide-gray-100">{allUsers.map((user) => (<tr key={user._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-colors"><td className="px-4 sm:px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td><td className="px-4 sm:px-6 py-4 text-sm text-gray-700">{user.email}</td><td className="px-4 sm:px-6 py-4"><select value={user.role} onChange={(e) => handleUpdateUserRole(user._id, e.target.value)} className={`px-3 py-1.5 text-xs font-semibold rounded-full border-0 ${user.role === 'admin' ? 'bg-gradient-to-r from-red-500 to-red-600 text-white' : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'}`}><option value="user">User</option><option value="admin">Admin</option></select></td><td className="px-4 sm:px-6 py-4 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td><td className="px-4 sm:px-6 py-4"><button onClick={() => handleDeleteUser(user._id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><HiTrash className="h-5 w-5" /></button></td></tr>))}</tbody></table></div></div></div>)}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

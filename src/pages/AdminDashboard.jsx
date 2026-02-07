import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  HiHome, HiDocumentText, HiBookOpen, HiUsers, HiChartBar, 
  HiCog, HiPlus, HiEye, HiPencil, HiTrash, HiStar,
  HiTrendingUp, HiTrendingDown, HiCurrencyDollar, HiMenu, HiX,
  HiCheckCircle, HiXCircle, HiClock
} from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';
import UserManagement from '../components/UserManagement';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    articles: { total: 0, published: 0, drafts: 0 },
    ebooks: { total: 0, published: 0, drafts: 0 },
    users: { total: 0, active: 0 },
    revenue: { total: 0, thisMonth: 0 }
  });
  const [recentArticles, setRecentArticles] = useState([]);
  const [recentEbooks, setRecentEbooks] = useState([]);
  const [allArticles, setAllArticles] = useState([]);
  const [allEbooks, setAllEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: '', id: '', title: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [articlesRes, ebooksRes, usersRes] = await Promise.all([
        apiService.articles.getAll({ limit: 50 }),
        apiService.ebooks.getAll({ limit: 50 }),
        apiService.admin.getUsers({ limit: 5 })
      ]);

      const articlesData = articlesRes.data.data?.articles || articlesRes.data.articles || [];
      const ebooksData = ebooksRes.data.data?.ebooks || ebooksRes.data.ebooks || [];
      
      setAllArticles(articlesData);
      setAllEbooks(ebooksData);
      setRecentArticles(articlesData.slice(0, 5));
      setRecentEbooks(ebooksData.slice(0, 5));
      
      setStats({
        articles: {
          total: articlesData.length,
          published: articlesData.filter(a => a.status === 'published').length,
          drafts: articlesData.filter(a => a.status === 'draft').length
        },
        ebooks: {
          total: ebooksData.length,
          published: ebooksData.filter(e => e.status === 'published').length,
          drafts: ebooksData.filter(e => e.status === 'draft').length
        },
        users: {
          total: usersRes.data?.pagination?.total || 0,
          active: usersRes.data?.data?.users?.filter(u => u.isActive).length || 0
        },
        revenue: {
          total: ebooksData.reduce((sum, e) => sum + (e.price || 0), 0),
          thisMonth: ebooksData.filter(e => {
            const date = new Date(e.createdAt);
            const now = new Date();
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          }).reduce((sum, e) => sum + (e.price || 0), 0)
        }
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const sidebarItems = [
    { id: 'dashboard', name: '𞤃𞤢𞤧𞤦𞤮𞤪𞤣', icon: HiHome },
    { id: 'articles', name: '𞤃𞤢𞤦𞤢𞤤𞤫', icon: HiDocumentText },
    { id: 'ebooks', name: '𞤃𞤫𞤧𞤫', icon: HiBookOpen },
    { id: 'users', name: '𞤖𞤮𞤪𞤦𞤫', icon: HiUsers },
    { id: 'analytics', name: '𞤀𞤲𞤢𞤤𞤭𞤼𞤭𞤳', icon: HiChartBar },
    { id: 'settings', name: '𞤅𞤫𞤼𞤭𞤲𞤺', icon: HiCog }
  ];

  const handleDeleteArticle = async (id) => {
    try {
      await apiService.articles.delete(id);
      setAllArticles(allArticles.filter(article => article._id !== id));
      setRecentArticles(recentArticles.filter(article => article._id !== id));
      setStats(prev => ({
        ...prev,
        articles: { ...prev.articles, total: prev.articles.total - 1 }
      }));
      setDeleteModal({ show: false, type: '', id: '', title: '' });
    } catch (error) {
      console.error('Error deleting article:', error);
      alert('𞤑𞤢𞤤𞤢 𞤲𞤢𞤲 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤦𞤢𞤤');
    }
  };

  const handleDeleteEbook = async (id) => {
    try {
      await apiService.ebooks.delete(id);
      setAllEbooks(allEbooks.filter(ebook => ebook._id !== id));
      setRecentEbooks(recentEbooks.filter(ebook => ebook._id !== id));
      setStats(prev => ({
        ...prev,
        ebooks: { ...prev.ebooks, total: prev.ebooks.total - 1 }
      }));
      setDeleteModal({ show: false, type: '', id: '', title: '' });
    } catch (error) {
      console.error('Error deleting ebook:', error);
      alert('𞤑𞤢𞤤𞤢 𞤲𞤢𞤲 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤫𞤧𞤮');
    }
  };

  const openDeleteModal = (type, id, title) => {
    setDeleteModal({ show: true, type, id, title });
  };

  const confirmDelete = () => {
    if (deleteModal.type === 'article') {
      handleDeleteArticle(deleteModal.id);
    } else if (deleteModal.type === 'ebook') {
      handleDeleteEbook(deleteModal.id);
    }
  };

  const StatCard = ({ title, value, change, icon: Icon, color = 'blue' }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate" dir="rtl">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <div className={`flex items-center mt-2 text-xs sm:text-sm ${
              change > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {change > 0 ? <HiTrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> : <HiTrendingDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <div className={`p-2 sm:p-3 rounded-full bg-${color}-100 flex-shrink-0`}>
          <Icon className={`h-5 w-5 sm:h-6 sm:w-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <HiTrash className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2" dir="rtl">
              𞤚𞤢𞤧𞤣𞤭𞤲 𞤸𞤢𞤤𞤢𞤲𞤣𞤫
            </h3>
            <p className="text-gray-600 text-center mb-6" dir="rtl">
              𞤀 𞤴𞤮𞤲𞤢𞤲 𞤸𞤢𞤤𞤢𞤲 "{deleteModal.title}"?
            </p>
            <div className="flex space-x-3 space-x-reverse">
              <button
                onClick={() => setDeleteModal({ show: false, type: '', id: '', title: '' })}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                𞤘𞤮𞤤𞤤𞤮𞤣𞤫
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                𞤘𞤢𞤤𞤢𞤲
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {sidebarOpen ? (
            <HiX className="h-6 w-6 text-gray-900" />
          ) : (
            <HiMenu className="h-6 w-6 text-gray-900" />
          )}
        </button>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <div className={`
          fixed lg:static inset-y-0 right-0 z-40
          lg:w-64 w-64 bg-white shadow-lg border-r border-gray-200 lg:min-h-screen
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900" dir="rtl">
              ⚙️ 𞤀𞤣𞤥𞤭𞤲 𞤃𞤢𞤧𞤦𞤮𞤪𞤣
            </h2>
          </div>
          
          <nav className="flex flex-col overflow-y-auto mt-6">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 sm:px-6 py-3 text-left transition-colors duration-200 ${
                  activeTab === item.id
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                dir="rtl"
              >
                <item.icon className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3" />
                <span className="text-sm sm:text-base">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {activeTab === 'dashboard' && (
            <div>
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2" dir="rtl">
                  𞤃𞤢𞤧𞤦𞤮𞤪𞤣 𞤀𞤣𞤥𞤭𞤲
                </h1>
                <p className="text-sm sm:text-base text-gray-600" dir="rtl">
                  𞤅𞤢𞤸𞤢 𞤫 𞤀𞤣𞤤𞤢𞤥 𞤆𞤤𞤢𞤼𞤬𞤮𞤪𞤥
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <StatCard
                  title="𞤃𞤢𞤦𞤢𞤤𞤫 𞤊𞤮𞤼𞤼𞤢𞤤"
                  value={stats.articles.total}
                  change={12}
                  icon={HiDocumentText}
                  color="blue"
                />
                <StatCard
                  title="𞤃𞤫𞤧𞤫 𞤊𞤮𞤼𞤼𞤢𞤤"
                  value={stats.ebooks.total}
                  change={8}
                  icon={HiBookOpen}
                  color="green"
                />
                <StatCard
                  title="𞤖𞤮𞤪𞤦𞤫 𞤊𞤮𞤼𞤼𞤢𞤤"
                  value={stats.users.total}
                  change={15}
                  icon={HiUsers}
                  color="purple"
                />
                <StatCard
                  title="𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤊𞤮𞤼𞤼𞤢𞤤"
                  value={`${stats.revenue.total.toLocaleString()} GNF`}
                  change={22}
                  icon={HiCurrencyDollar}
                  color="yellow"
                />
              </div>

              {/* Recent Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                {/* Recent Articles */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900" dir="rtl">
                      𞤃𞤢𞤦𞤢𞤤𞤫 𞤀𞤪𞤢𞤲
                    </h3>
                    <Link
                      to="/admin/articles/new"
                      className="flex items-center justify-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                    >
                      <HiPlus className="h-4 w-4 mr-2" />
                      𞤚𞤢𞤥𞤭
                    </Link>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {recentArticles.slice(0, 5).map((article) => (
                      <div key={article._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1 min-w-0 mr-2" dir="rtl">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{article.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {article.status}
                            </span>
                            <span className="text-xs text-gray-500">{article.views || 0} 👁️</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          <Link
                            to={`/articles/${article.slug}`}
                            target="_blank"
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="𞤴𞤮𞤲𞤢𞤲"
                          >
                            <HiEye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/articles/edit/${article._id}`}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="𞤻𞤫𞤪𞤲𞤣𞤫"
                          >
                            <HiPencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => openDeleteModal('article', article._id, article.title)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="𞤸𞤢𞤤𞤢𞤲"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Ebooks */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900" dir="rtl">
                      𞤃𞤫𞤧𞤫 𞤀𞤪𞤢𞤲
                    </h3>
                    <Link
                      to="/admin/ebooks/new"
                      className="flex items-center justify-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base"
                    >
                      <HiPlus className="h-4 w-4 mr-2" />
                      𞤚𞤢𞤥𞤭
                    </Link>
                  </div>
                  <div className="space-y-3 sm:space-y-4">
                    {recentEbooks.slice(0, 5).map((ebook) => (
                      <div key={ebook._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex-1 min-w-0 mr-2" dir="rtl">
                          <h4 className="text-sm sm:text-base font-medium text-gray-900 truncate">{ebook.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                              ebook.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {ebook.status}
                            </span>
                            <span className="text-xs text-gray-500">{ebook.price} GNF</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                          <Link
                            to={`/ebooks/${ebook.slug}`}
                            target="_blank"
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="𞤴𞤮𞤲𞤢𞤲"
                          >
                            <HiEye className="h-4 w-4" />
                          </Link>
                          <Link
                            to={`/admin/ebooks/edit/${ebook._id}`}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="𞤻𞤫𞤪𞤲𞤣𞤫"
                          >
                            <HiPencil className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => openDeleteModal('ebook', ebook._id, ebook.title)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="𞤸𞤢𞤤𞤢𞤲"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'articles' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" dir="rtl">
                  𞤃𞤢𞤦𞤢𞤤𞤫 𞤃𞤢𞤲𞤢𞤺𞤫
                </h1>
                <Link
                  to="/admin/articles/new"
                  className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base"
                >
                  <HiPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  𞤃𞤢𞤦𞤢𞤤 𞤚𞤢𞤥𞤭
                </Link>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤚𞤢𞤦𞤭</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤅𞤼𞤢𞤼𞤵𞤧</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤚𞤢𞤪𞤭𞤸</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤀𞤳𞤧𞤢𞤲</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allArticles.map((article) => (
                        <tr key={article._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="text-sm font-medium text-gray-900 line-clamp-2" dir="rtl">
                              {article.title}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {article.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Link
                                to={`/articles/${article.slug}`}
                                target="_blank"
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="𞤴𞤮𞤲𞤢𞤲"
                              >
                                <HiEye className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/articles/edit/${article._id}`}
                                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                title="𞤻𞤫𞤪𞤲𞤣𞤫"
                              >
                                <HiPencil className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => openDeleteModal('article', article._id, article.title)}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                title="𞤸𞤢𞤤𞤢𞤲"
                              >
                                <HiTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <UserManagement />
          )}

          {activeTab === 'ebooks' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900" dir="rtl">
                  𞤃𞤫𞤧𞤫 𞤃𞤢𞤲𞤢𞤺𞤫
                </h1>
                <Link
                  to="/admin/ebooks/new"
                  className="flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors shadow-lg text-sm sm:text-base"
                >
                  <HiPlus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  𞤃𞤫𞤧𞤫 𞤚𞤢𞤥𞤭
                </Link>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤚𞤢𞤦𞤭</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤅𞤼𞤢𞤼𞤵𞤧</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤚𞤢𞤪𞤭𞤸</th>
                        <th className="px-6 py-4 text-right text-sm font-medium text-gray-500">𞤀𞤳𞤧𞤢𞤲</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {allEbooks.map((ebook) => (
                        <tr key={ebook._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
                              <img
                                src={ebook.coverImage ? `http://localhost:5000${ebook.coverImage}` : '/placeholder-book.jpg'}
                                alt={ebook.title}
                                className="w-10 h-14 sm:w-12 sm:h-16 object-cover rounded shadow-sm"
                                onError={(e) => { e.target.src = '/placeholder-book.jpg'; }}
                              />
                              <div className="text-sm font-medium text-gray-900 line-clamp-2" dir="rtl">
                                {ebook.title}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500" dir="rtl">
                            {ebook.author}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              ebook.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {ebook.status}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500">
                            {new Date(ebook.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 sm:px-6 py-3 sm:py-4">
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              <Link
                                to={`/ebooks/${ebook.slug}`}
                                target="_blank"
                                className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                title="𞤴𞤮𞤲𞤢𞤲"
                              >
                                <HiEye className="h-4 w-4" />
                              </Link>
                              <Link
                                to={`/admin/ebooks/edit/${ebook._id}`}
                                className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded transition-colors"
                                title="𞤻𞤫𞤪𞤲𞤣𞤫"
                              >
                                <HiPencil className="h-4 w-4" />
                              </Link>
                              <button
                                onClick={() => openDeleteModal('ebook', ebook._id, ebook.title)}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                title="𞤸𞤢𞤤𞤢𞤲"
                              >
                                <HiTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8" dir="rtl">
                𞤀𞤲𞤢𞤤𞤭𞤼𞤭𞤳 & 𞤘𞤪𞤢𞤬𞤭𞤳
              </h1>
              
              {/* Charts and Analytics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
                    𞤃𞤢𞤦𞤢𞤤𞤫 𞤅𞤼𞤢𞤼𞤭𞤧𞤼𞤭𞤳
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600" dir="rtl">𞤀𞤣𞤢𞤦𞤢𞤲</span>
                      <span className="font-semibold">{stats.articles.published}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600" dir="rtl">𞤃𞤪𞤢𞤬𞤼</span>
                      <span className="font-semibold">{stats.articles.drafts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600" dir="rtl">𞤊𞤮𞤼𞤼𞤢𞤤</span>
                      <span className="font-semibold">{stats.articles.total}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
                    𞤃𞤫𞤧𞤫 𞤅𞤼𞤢𞤼𞤭𞤧𞤼𞤭𞤳
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600" dir="rtl">𞤀𞤣𞤢𞤦𞤢𞤲</span>
                      <span className="font-semibold">{stats.ebooks.published}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600" dir="rtl">𞤃𞤪𞤢𞤬𞤼</span>
                      <span className="font-semibold">{stats.ebooks.drafts}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600" dir="rtl">𞤊𞤮𞤼𞤼𞤢𞤤</span>
                      <span className="font-semibold">{stats.ebooks.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8" dir="rtl">
                𞤅𞤫𞤼𞤭𞤲𞤺 𞤅𞤭𞤧𞤼𞤢𞤥
              </h1>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
                    𞤅𞤭𞤧𞤼𞤢𞤥 𞤘𞤫𞤲𞤫𞤪𞤢𞤤
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                        𞤐𞤢𞤥 𞤅𞤢𞤭𞤼
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="𞤀𞤣𞤤𞤢𞤥 𞤆𞤤𞤢𞤼𞤬𞤮𞤪𞤥"
                        dir="rtl"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                        𞤗𞤫𞤧𞤳𞤪𞤭𞤪𞤼𞤭𞤮𞤲
                      </label>
                      <textarea
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        defaultValue="𞤆𞤤𞤢𞤼𞤬𞤮𞤪𞤥 𞤫 𞤀𞤣𞤤𞤢𞤥 𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤊𞤵𞤤𞤢𞤪"
                        dir="rtl"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
                    𞤅𞤭𞤧𞤼𞤢𞤥 𞤅𞤭𞤧𞤵𞤪𞤭𞤼𞤭
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700" dir="rtl">𞤐𞤮𞤼𞤭𞤬𞤭𞤳𞤢𞤧𞤭𞤮𞤲 𞤀𞤵𞤼𞤮𞤥𞤢𞤼𞤭𞤳</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700" dir="rtl">𞤐𞤮𞤼𞤭𞤬𞤭𞤳𞤢𞤧𞤭𞤮𞤲 𞤃𞤢𞤲𞤵𞤢𞤤</span>
                      <input type="checkbox" className="rounded" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700" dir="rtl">𞤃𞤮𞤣𞤫𞤪𞤢𞤧𞤭𞤮𞤲 𞤀𞤵𞤼𞤮𞤥𞤢𞤼𞤭𞤳</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
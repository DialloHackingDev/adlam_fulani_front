import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiEye,
  HiNewspaper,
  HiBookOpen,
  HiUsers,
  HiCurrencyDollar
} from 'react-icons/hi';
import { articlesAPI, ebooksAPI } from '../../services/api';
import { adminArticlesAPI, adminEbooksAPI, adminDashboardAPI } from '../../services/adminAPI';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalEbooks: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('articles');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesRes, ebooksRes, statsRes] = await Promise.all([
        articlesAPI.getAll(),
        ebooksAPI.getAll(),
        adminDashboardAPI.getStats()
      ]);
      
      setArticles(articlesRes.data.articles || []);
      setEbooks(ebooksRes.data.ebooks || []);
      setStats(statsRes.data.stats || {});
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('𞤀 𞤴𞤮𞤲𞤢𞤲 𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫 𞤸𞤢𞤤𞤢𞤲?')) {
      try {
        await adminArticlesAPI.delete(id);
        setArticles(articles.filter(article => article._id !== id));
        // Mettre à jour les stats
        setStats(prev => ({ ...prev, totalArticles: prev.totalArticles - 1 }));
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handleDeleteEbook = async (id) => {
    if (window.confirm('𞤀 𞤴𞤮𞤲𞤢𞤲 𞤃𞤫𞤧𞤮 𞤲𞤣𞤫 𞤸𞤢𞤤𞤢𞤲?')) {
      try {
        await adminEbooksAPI.delete(id);
        setEbooks(ebooks.filter(ebook => ebook._id !== id));
        // Mettre à jour les stats
        setStats(prev => ({ ...prev, totalEbooks: prev.totalEbooks - 1 }));
      } catch (error) {
        console.error('Error deleting ebook:', error);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ar');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8" dir="rtl">
          <h1 className="text-3xl font-bold text-black mb-2">
            𞤃𞤢𞤪𞤸𞤢𞤤 𞤀𞤣𞤥𞤭𞤲
          </h1>
          <p className="text-gray-600">
            𞤃𞤢𞤪𞤸𞤢𞤤 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤃𞤫𞤧𞤫
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">𞤃𞤢𞤦𞤢𞤤𞤫</p>
                <p className="text-3xl font-bold text-black">{stats.totalArticles}</p>
              </div>
              <HiNewspaper className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">𞤃𞤫𞤧𞤫</p>
                <p className="text-3xl font-bold text-black">{stats.totalEbooks}</p>
              </div>
              <HiBookOpen className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">𞤖𞤢𞤤𞤤𞤮𞤦𞤫</p>
                <p className="text-3xl font-bold text-black">{stats.totalUsers}</p>
              </div>
              <HiUsers className="h-12 w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">𞤅𞤢𞤪𞤭</p>
                <p className="text-3xl font-bold text-black">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <HiCurrencyDollar className="h-12 w-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 space-x-reverse px-6" dir="rtl">
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'articles'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                𞤃𞤢𞤦𞤢𞤤𞤫 ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab('ebooks')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'ebooks'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                𞤃𞤫𞤧𞤫 ({ebooks.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Add Button */}
            <div className="flex justify-between items-center mb-6" dir="rtl">
              <h2 className="text-xl font-bold text-black">
                {activeTab === 'articles' ? '𞤃𞤢𞤦𞤢𞤤𞤫' : '𞤃𞤫𞤧𞤫'}
              </h2>
              <Link
                to={activeTab === 'articles' ? '/admin/articles/new' : '/admin/ebooks/new'}
                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
              >
                <HiPlus className="h-5 w-5 ml-2" />
                {activeTab === 'articles' ? '𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮' : '𞤃𞤫𞤧𞤮 𞤑𞤫𞤧𞤮'}
              </Link>
            </div>

            {/* Articles Tab */}
            {activeTab === 'articles' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr dir="rtl">
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        𞤀𞤪𞤣𞤫
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        𞤊𞤮𞤪𞤲𞤣𞤫
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        𞤚𞤢𞤪𞤭𞤸𞤮
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        𞤀𞤪𞤣𞤫
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {articles.map((article) => (
                      <tr key={article._id} dir="rtl">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={article.coverImage || '/placeholder-image.jpg'}
                                alt=""
                              />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {article.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {article.published ? '𞤱𞤢𞤤𞤤𞤭𞤲𞤢𞤲' : '𞤸𞤢𞤤𞤢𞤲𞤢𞤲'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {article.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(article.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <Link
                              to={`/articles/${article.slug}`}
                              className="text-gray-600 hover:text-black"
                            >
                              <HiEye className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/admin/articles/edit/${article._id}`}
                              className="text-gray-600 hover:text-black"
                            >
                              <HiPencil className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(article._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <HiTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Ebooks Tab */}
            {activeTab === 'ebooks' && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr dir="rtl">
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        𞤀𞤪𞤣𞤫
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        𞤅𞤢𞤪𞤭
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        𞤀𞤪𞤣𞤫
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ebooks.map((ebook) => (
                      <tr key={ebook._id} dir="rtl">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded object-cover"
                                src={ebook.coverImage || '/placeholder-book.jpg'}
                                alt=""
                              />
                            </div>
                            <div className="mr-4">
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {ebook.title}
                              </div>
                              <div className="text-sm text-gray-500">
                                {ebook.published ? '𞤱𞤢𞤤𞤤𞤭𞤲𞤢𞤲' : '𞤸𞤢𞤤𞤢𞤲𞤢𞤲'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {ebook.author}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatPrice(ebook.price)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2 space-x-reverse">
                            <Link
                              to={`/library/${ebook.slug}`}
                              className="text-gray-600 hover:text-black"
                            >
                              <HiEye className="h-5 w-5" />
                            </Link>
                            <Link
                              to={`/admin/ebooks/edit/${ebook._id}`}
                              className="text-gray-600 hover:text-black"
                            >
                              <HiPencil className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleDeleteEbook(ebook._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <HiTrash className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Empty State */}
            {((activeTab === 'articles' && articles.length === 0) || 
              (activeTab === 'ebooks' && ebooks.length === 0)) && (
              <div className="text-center py-12" dir="rtl">
                <div className="text-gray-400 text-6xl mb-4">
                  {activeTab === 'articles' ? '📰' : '📚'}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  𞤅𞤢𞤪𞤣𞤭 {activeTab === 'articles' ? '𞤃𞤢𞤦𞤢𞤤𞤫' : '𞤃𞤫𞤧𞤫'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'articles' ? '𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮 𞤸𞤫𞤧𞤮' : '𞤃𞤫𞤧𞤮 𞤑𞤫𞤧𞤮 𞤸𞤫𞤧𞤮'}
                </p>
                <Link
                  to={activeTab === 'articles' ? '/admin/articles/new' : '/admin/ebooks/new'}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center"
                >
                  <HiPlus className="h-5 w-5 ml-2" />
                  {activeTab === 'articles' ? '𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮' : '𞤃𞤫𞤧𞤮 𞤑𞤫𞤧𞤮'}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
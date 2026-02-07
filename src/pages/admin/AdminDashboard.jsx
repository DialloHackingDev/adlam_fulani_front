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
  HiCurrencyDollar,
  HiChartBar,
  HiTrendingUp,
  HiDocument
} from 'react-icons/hi';
import { apiService } from '../../services/apiService';
import DashboardCharts from '../../components/admin/DashboardCharts';

const AdminDashboard = () => {
  const [articles, setArticles] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalEbooks: 0,
    totalUsers: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [chartData, setChartData] = useState({
    viewsData: null,
    revenueData: null,
    trafficData: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [articlesRes, ebooksRes, documentsRes, statsRes] = await Promise.all([
        apiService.articles.getAll(),
        apiService.ebooks.getAll(),
        apiService.documents.getAll(),
        apiService.admin.getStats()
      ]);
      
      // Extraire les données avec fallbacks
      const articlesData = articlesRes.data.data?.articles || articlesRes.data.articles || [];
      const ebooksData = ebooksRes.data.data?.ebooks || ebooksRes.data.ebooks || [];
      const documentsData = documentsRes.data.data?.documents || documentsRes.data.documents || [];
      const statsData = statsRes.data.data?.stats || statsRes.data.stats || {};
      
      setArticles(articlesData);
      setEbooks(ebooksData);
      setDocuments(documentsData);
      setStats({
        totalArticles: statsData.totalArticles || articlesData.length,
        totalEbooks: statsData.totalEbooks || ebooksData.length,
        totalUsers: statsData.totalUsers || 0,
        totalRevenue: statsData.totalRevenue || 0
      });
      
      // Simuler les données pour les graphiques (remplacer avec de vraies données API)
      setChartData({
        viewsData: {
          labels: ['𞤀𞤢𞤸𞤢', '𞤀𞤭𞤲𞤭𞥄𞤲', '𞤚𞤢𞤤𞤭𞥄𞤲', '𞤀𞤪𞤦𞤢𞤲', '𞤀𞤭𞤥𞤭𞥄𞤲', '𞤚𞤭𞤥𞤭𞥄𞤲', '𞤔𞤭𞤥𞤭𞥄𞤲'],
          data: [120, 190, 300, 500, 200, 300, 450]
        },
        revenueData: {
          labels: ['𞤔𞤢𞤲𞤺𞤮𞤤', '𞤊𞤵𞤪𞤭𞥄𞤲', '𞤚𞤢𞤪𞤭𞥄𞤲', '𞤀𞤪𞤦𞤢𞤲', '𞤃𞤭𞥄𞤲', '𞤔𞤭𞤥𞤭𞥄𞤲'],
          data: [65000, 59000, 80000, 81000, 56000, 95000]
        },
        trafficData: {
          labels: ['𞤁𞤫𞥄𞤪𞤭𞤳', '𞤐𞤢𞥄𞤴𞤭𞥄𞤲 𞤢𞤪𞤺𞤢𞥄𞤲𞤭𞤺', '𞤈𞤵𞤴𞤢𞥄𞴴 𞤫𞥊𞤲𞤣𞤫', '𞤈𞤭𞤲𞤢𞥄𞤲𞤭𞥄𞤲'],
          data: [3000, 2500, 2000, 1500]
        }
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      // En cas d'erreur, utiliser des valeurs par défaut
      setStats({
        totalArticles: 0,
        totalEbooks: 0,
        totalUsers: 0,
        totalRevenue: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id) => {
    if (window.confirm('𞤀 𞤴𞤮𞤲𞤢𞤲 𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫 𞤸𞤢𞤤𞤢𞤲?')) {
      try {
        await apiService.articles.delete(id);
        setArticles(articles.filter(article => article._id !== id));
        setStats(prev => ({ ...prev, totalArticles: prev.totalArticles - 1 }));
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handleDeleteEbook = async (id) => {
    if (window.confirm('𞤀 𞤴𞤮𞤲𞤢𞤲 𞤃𞤫𞤧𞤮 𞤲𞤣𞤫 𞤸𞤢𞤤𞤢𞤲?')) {
      try {
        await apiService.ebooks.delete(id);
        setEbooks(ebooks.filter(ebook => ebook._id !== id));
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
        <div className="mb-6 sm:mb-8" dir="rtl">
          <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
            𞤃𞤢𞤪𞤸𞤢𞤤 𞤀𞤣𞤥𞤭𞤲
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            𞤃𞤢𞤪𞤸𞤢𞤤 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤃𞤫𞤧𞤫
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">𞤃𞤢𞤦𞤢𞤤𞤫</p>
                <p className="text-2xl sm:text-3xl font-bold text-black">{stats.totalArticles}</p>
              </div>
              <HiNewspaper className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">𞤃𞤫𞤧𞤫</p>
                <p className="text-2xl sm:text-3xl font-bold text-black">{stats.totalEbooks}</p>
              </div>
              <HiBookOpen className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">𞤖𞤢𞤤𞤤𞤮𞤦𞤫</p>
                <p className="text-2xl sm:text-3xl font-bold text-black">{stats.totalUsers}</p>
              </div>
              <HiUsers className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-white p-4 sm:p-6 border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">𞤅𞤢𞤪𞤭</p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">{formatPrice(stats.totalRevenue)}</p>
              </div>
              <HiCurrencyDollar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-200 rounded-lg">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex space-x-4 sm:space-x-8 space-x-reverse px-4 sm:px-6" dir="rtl">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <HiChartBar className="inline ml-2 h-4 w-4" />
                <span className="hidden sm:inline">𞤚𞤵𞤤𞤭𞥄𞤲 𞤏𞤢𞥄𞤲𞤭𞥄𞤲</span>
                <span className="sm:hidden">𞤚𞤵𞤤𞤭𞥄𞤲</span>
              </button>
              <button
                onClick={() => setActiveTab('articles')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'articles'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                𞤃𞤢𞤦𞤢𞤤𞤫 ({articles.length})
              </button>
              <button
                onClick={() => setActiveTab('ebooks')}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === 'ebooks'
                    ? 'border-black text-black'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                𞤃𞤫𞤧𞤫 ({ebooks.length})
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'overview' && (
              <div>
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <h2 className="text-lg sm:text-xl font-bold text-black flex items-center">
                    <HiTrendingUp className="ml-2 sm:ml-3 h-5 w-5 sm:h-6 sm:w-6" />
                    <span className="hidden sm:inline">𞤈𞤭𞤲𞤢𞥄𞤲𞤭𞥄𞤲 𞤫 𞤀𞤲𞤢𞥄𞤤𞤭𞤼𞤭𞥄𞤲</span>
                    <span className="sm:hidden">𞤈𞤭𞤲𞤢𞥄𞤲𞤭𞥄𞤲</span>
                  </h2>
                  <div className="text-xs sm:text-sm text-gray-500">
                    𞤁𞤢𞤪𞤭𞥄𞤲 30 𞤴𞤮𞤪𞤭𞥄𞤲
                  </div>
                </div>
                <DashboardCharts 
                  stats={stats}
                  viewsData={chartData.viewsData}
                  revenueData={chartData.revenueData}
                  trafficData={chartData.trafficData}
                />
              </div>
            )}

            {activeTab === 'articles' && (
              <div>
                {/* Add Button */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3" dir="rtl">
                  <h2 className="text-lg sm:text-xl font-bold text-black">𞤃𞤢𞤦𞤢𞤤𞤫</h2>
                  <Link
                    to="/admin/articles/new"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <HiPlus className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮
                  </Link>
                </div>

                {/* Articles Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr dir="rtl">
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤀𞤪𞤣𞤫
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤑𞤢𞼺𞤫𞤺𞤮𞥄𞤪𞤭
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤚𞤢𞤥𞤭𞤪
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤔𞤢𞤲𞤺𞤮𞤤
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤔𞤭𞤥𞤭𞥄𞤲
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">𞤔𞤭𞤥𞤭𞥄𞤲</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {articles.slice(0, 10).map((article) => (
                        <tr key={article._id} dir="rtl">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {article.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {article.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(article.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {article.views || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {article.likes || 0}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <div className="flex space-x-2 space-x-reverse sm:space-x-2 sm:space-x-reverse">
                              <Link
                                to={`/articles/${article.slug}`}
                                className="text-gray-600 hover:text-gray-900 p-1 sm:p-0"
                                target="_blank"
                                title="𞤴𞤮𞤲𞤢𞤲"
                              >
                                <HiEye className="h-5 w-5 sm:h-4 sm:w-4" />
                              </Link>
                              <Link
                                to={`/admin/articles/edit/${article._id}`}
                                className="text-gray-600 hover:text-gray-900 p-1 sm:p-0"
                                title="𞤻𞤫𞤪𞤲𞤣𞤫"
                              >
                                <HiPencil className="h-5 w-5 sm:h-4 sm:w-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteArticle(article._id)}
                                className="text-red-600 hover:text-red-900 p-1 sm:p-0"
                                title="𞤸𞤢𞤤𞤢𞤲"
                              >
                                <HiTrash className="h-5 w-5 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'ebooks' && (
              <div>
                {/* Add Button */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-3" dir="rtl">
                  <h2 className="text-lg sm:text-xl font-bold text-black">𞤃𞤫𞤧𞤫</h2>
                  <Link
                    to="/admin/ebooks/new"
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-sm sm:text-base"
                  >
                    <HiPlus className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                    𞤃𞤫𞤧𞤮 𞤑𞤫𞤧𞤮
                  </Link>
                </div>

                {/* Ebooks Table */}
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr dir="rtl">
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤀𞤪𞤣𞤫
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤀𞤢𞤥𞤭𞥄𞤲
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤑𞤢𞤼
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          𞤔𞤢𞤲𞤺𞤮𞤤
                        </th>
                        <th className="relative px-6 py-3">
                          <span className="sr-only">𞤔𞤭𞤥𞤭𞥄𞤲</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ebooks.slice(0, 10).map((ebook) => (
                        <tr key={ebook._id} dir="rtl">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {ebook.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {ebook.author}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatPrice(ebook.price)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(ebook.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium">
                            <div className="flex space-x-2 space-x-reverse sm:space-x-2 sm:space-x-reverse">
                              <Link
                                to={`/ebooks/${ebook.slug}`}
                                className="text-gray-600 hover:text-gray-900 p-1 sm:p-0"
                                target="_blank"
                                title="𞤴𞤮𞤲𞤢𞤲"
                              >
                                <HiEye className="h-5 w-5 sm:h-4 sm:w-4" />
                              </Link>
                              <Link
                                to={`/admin/ebooks/edit/${ebook._id}`}
                                className="text-gray-600 hover:text-gray-900 p-1 sm:p-0"
                                title="𞤻𞤫𞤪𞤲𞤣𞤫"
                              >
                                <HiPencil className="h-5 w-5 sm:h-4 sm:w-4" />
                              </Link>
                              <button
                                onClick={() => handleDeleteEbook(ebook._id)}
                                className="text-red-600 hover:text-red-900 p-1 sm:p-0"
                                title="𞤸𞤢𞤤𞤢𞤲"
                              >
                                <HiTrash className="h-5 w-5 sm:h-4 sm:w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

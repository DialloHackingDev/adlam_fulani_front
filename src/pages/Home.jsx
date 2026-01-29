import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiNewspaper, 
  HiBookOpen, 
  HiAcademicCap, 
  HiGlobeAlt,
  HiArrowRight,
  HiTrendingUp,
  HiStar,
  HiEye,
  HiHeart,
  HiClock,
  HiChevronRight
} from 'react-icons/hi';
import HeroBanner from '../components/HeroBanner';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import { apiService } from '../services/apiService';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [popularArticles, setPopularArticles] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalEbooks: 0,
    totalReads: 0
  });

  const categories = [
    { id: 'all', name: '𞤊𞤮𞤪𞤪𞤫 𞤃𞤢𞤦𞤢𞤤𞤫', icon: HiGlobeAlt },
    { id: 'litterature', name: '𞤀𞤣𞤢𞤦𞤢𞤲', icon: HiBookOpen },
    { id: 'histoire', name: '𞤚𞤢𞤪𞤭𞤲𞤢𞤤', icon: HiAcademicCap },
    { id: 'education', name: '𞤔𞤢𞤲𞤺𞤢𞤤', icon: HiAcademicCap },
    { id: 'culture', name: '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤', icon: HiStar },
    { id: 'science', name: '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭', icon: HiTrendingUp },
    { id: 'religion', name: '𞤄𞤭𞤲𞤢𞤤', icon: HiStar },
  ];

  const quickLinks = [
    { title: '𞤃𞤢𞤦𞤢𞤤𞤫', desc: '𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤃𞤢𞤦𞤢𞤤𞤫', path: '/articles', icon: HiNewspaper, color: 'bg-blue-500' },
    { title: '𞤃𞤫𞤧𞤫', desc: '𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤃𞤫𞤧𞤫', path: '/ebooks', icon: HiBookOpen, color: 'bg-green-500' },
    { title: '𞤔𞤢𞤲𞤺𞤮𞤤', desc: '𞤔𞤢𞤲𞤺𞤮𞤤 𞤫 𞤀𞤣𞤤𞤢𞤥', path: '/education', icon: HiAcademicCap, color: 'bg-purple-500' },
    { title: '𞤔𞤮𞤲𞤲𞤣𞤭', desc: '𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤀𞤥𞤫𞤲', path: '/contact', icon: HiGlobeAlt, color: 'bg-orange-500' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch real data from APIs
        const [allResponse, recentResponse, featuredResponse, popularResponse, ebooksResponse] = await Promise.allSettled([
          apiService.articles.getAll({ limit: 50 }),
          apiService.articles.getRecent(6),
          apiService.articles.getFeatured(3),
          apiService.articles.getPopular(4),
          apiService.ebooks.getRecent(4)
        ]);
        
        // Extract data with fallbacks for failed requests
        const allArticles = allResponse.status === 'fulfilled' 
          ? (allResponse.value.data.data?.articles || allResponse.value.data.articles || [])
          : [];
          
        const recentArticles = recentResponse.status === 'fulfilled'
          ? (recentResponse.value.data.data?.articles || recentResponse.value.data.articles || [])
          : allArticles.slice(0, 6);
          
        const featuredArticles = featuredResponse.status === 'fulfilled'
          ? (featuredResponse.value.data.data?.articles || featuredResponse.value.data.articles || [])
          : allArticles.filter(a => a.featured).slice(0, 3);
          
        const popularArticles = popularResponse.status === 'fulfilled'
          ? (popularResponse.value.data.data?.articles || popularResponse.value.data.articles || [])
          : allArticles.sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 4);
          
        const ebooks = ebooksResponse.status === 'fulfilled'
          ? (ebooksResponse.value.data.data?.ebooks || ebooksResponse.value.data.ebooks || [])
          : [];
        
        // Set state with real data
        setArticles(allArticles);
        setRecentArticles(recentArticles);
        setFeaturedArticles(featuredArticles);
        setPopularArticles(popularArticles);
        setEbooks(ebooks);
        
        // Calculate real statistics
        const totalViews = allArticles.reduce((sum, article) => sum + (article.views || 0), 0);
        const totalLikes = allArticles.reduce((sum, article) => sum + (article.likes || 0), 0);
        
        setStats({
          totalArticles: allArticles.length,
          totalEbooks: ebooks.length,
          totalReads: totalViews + totalLikes // Combined engagement metric
        });
        
        console.log('📊 Data loaded:', {
          articles: allArticles.length,
          ebooks: ebooks.length,
          recent: recentArticles.length,
          featured: featuredArticles.length,
          popular: popularArticles.length,
          totalViews,
          totalLikes
        });
        
      } catch (error) {
        console.error('❌ Error fetching data:', error);
        // Set fallback data if all requests fail
        setStats({
          totalArticles: 0,
          totalEbooks: 0,
          totalReads: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Stats Section */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                <HiNewspaper className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-2">{stats.totalArticles}</h3>
              <p className="text-gray-600" dir="rtl">𞤃𞤢𞤦𞤢𞤤𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
                <HiBookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-2">{stats.totalEbooks}</h3>
              <p className="text-gray-600" dir="rtl">𞤃𞤫𞤧𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4 group-hover:bg-purple-200 transition-colors">
                <HiEye className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-3xl font-bold text-black mb-2">{stats.totalReads.toLocaleString()}</h3>
              <p className="text-gray-600" dir="rtl">𞤴𞤮𞤲𞤢𞤲 𞤊𞤮𞤪𞤪𞤫</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" dir="rtl">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">𞤐𞤢𞤾𞤭𞤺𞤢𞤧𞤭𞤴𞤮𞤲 𞤊𞤢𞤪𞤭</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              𞤅𞤵𞤦𞤮 𞤫 𞤊𞤮𞤲𞤣𞤭 𞤃𞤢𞤳 𞤸𞤢𞤤𞤢𞤲 𞤫 𞤅𞤢𞤭𞤼 𞤲𞤣𞤫𞤲
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${link.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-black mb-3" dir="rtl">{link.title}</h3>
                    <p className="text-gray-600 mb-4" dir="rtl">{link.desc}</p>
                    <div className="flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                      <HiArrowRight className="h-5 w-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12" dir="rtl">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">𞤃𞤢𞤦𞤢𞤤𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫</h2>
              <p className="text-gray-600 text-lg">𞤃𞤢𞤦𞤢𞤤𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤𞤢𞤲 𞤫 𞤅𞤢𞤭𞤼 𞤲𞤣𞤫𞤲</p>
            </div>
            <Link
              to="/articles"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="mr-2" dir="rtl">𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤊𞤮𞤪𞤪𞤫</span>
              <HiChevronRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <HiNewspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2" dir="rtl">𞤀𞤤𞤢 𞤃𞤢𞤦𞤢𞤤𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫</h3>
              <p className="text-gray-400" dir="rtl">𞤃𞤢𞤦𞤢𞤤𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫 𞤸𞤢𞤤𞤢 𞤱𞤮𞤲𞤢𞤲𞤭</p>
            </div>
          )}
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12" dir="rtl">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-2">𞤃𞤢𞤦𞤢𞤤𞤫 𞤃𞤢𞤱𞤲𞤣𞤫</h2>
              <p className="text-gray-600">𞤃𞤢𞤦𞤢𞤤𞤫 𞤃𞤢𞤱𞤲𞤣𞤫 𞤫 𞤅𞤢𞤦𞤼𞤮𞤲𞤣𞤫</p>
            </div>
            <Link 
              to="/articles" 
              className="flex items-center text-black hover:text-gray-600 transition-colors font-medium"
            >
              <span className="ml-2">𞤴𞤮𞤲𞤢𞤲 𞤊𞤮𞤪𞤪𞤫</span>
              <HiChevronRight className="h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl">
                  <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredArticles.length > 0 ? (
                featuredArticles.map((article) => (
                  <ArticleCard key={article._id} article={article} featured />
                ))
              ) : (
                <div className="col-span-3 text-center py-12" dir="rtl">
                  <HiNewspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤃𞤢𞤱𞤲𞤣𞤫</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" dir="rtl">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤅𞤢𞤲𞤣𞤭𞤣𞤢𞤲 𞤕𞤮𞤤𞤢𞤲𞤭 𞤫 𞤀𞤣𞤤𞤢𞤥
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl">
                  <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentArticles.length > 0 ? (
                recentArticles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))
              ) : (
                <div className="col-span-3 text-center py-12" dir="rtl">
                  <HiClock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">𞤅𞤢𞤲𞤣𞤭 𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12" dir="rtl">
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">𞤅𞤢𞤦𞤼𞤮 𞤫 𞤊𞤮𞤲𞤣𞤭</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              𞤧𞤵𞤦𞤮 𞤊𞤮𞤲𞤣𞤭 𞤃𞤢𞤳 𞤸𞤢𞤤𞤢𞤲 𞤫 𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12" dir="rtl">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <IconComponent className="h-4 w-4 ml-2" />
                  {category.name}
                </button>
              );
            })}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-2xl">
                  <div className="aspect-video bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.slice(0, 9).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}

          {filteredArticles.length === 0 && !loading && (
            <div className="text-center py-16" dir="rtl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <HiNewspaper className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫</h3>
              <p className="text-gray-500">𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤊𞤮𞤲𞤣𞤭 𞤫𞤲𞤭</p>
            </div>
          )}

          {filteredArticles.length > 9 && (
            <div className="text-center mt-12">
              <Link
                to="/articles"
                className="inline-flex items-center px-8 py-4 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                <span className="ml-2">𞤴𞤮𞤲𞤢𞤲 𞤃𞤢𞤦𞤢𞤤𞤫 𞤊𞤮𞤪𞤪𞤫</span>
                <HiArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular Articles Sidebar */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Popular Articles */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8" dir="rtl">
                <h2 className="text-2xl font-bold text-black flex items-center">
                  <HiTrendingUp className="h-6 w-6 ml-2" />
                  𞤃𞤢𞤦𞤢𞤤𞤫 𞤃𞤢𞤧𞤸𞤵𞤪𞤫
                </h2>
              </div>
              
              <div className="space-y-6">
                {popularArticles.length > 0 ? (
                  popularArticles.map((article, index) => (
                    <Link
                      key={article._id}
                      to={`/articles/${article.slug}`}
                      className="flex items-start space-x-4 space-x-reverse p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 group"
                      dir="rtl"
                    >
                      <div className="flex-shrink-0">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-black text-white rounded-full text-sm font-bold">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-black group-hover:text-gray-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4 space-x-reverse">
                          <span className="flex items-center">
                            <HiEye className="h-4 w-4 ml-1" />
                            {article.views || 0}
                          </span>
                          <span className="flex items-center">
                            <HiHeart className="h-4 w-4 ml-1" />
                            {article.likes || 0}
                          </span>
                          <span className="flex items-center">
                            <HiClock className="h-4 w-4 ml-1" />
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12" dir="rtl">
                    <HiTrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤃𞤢𞤧𞤸𞤵𞤪𞤫</p>
                  </div>
                )}
              </div>
            </div>

            {/* E-books Sidebar */}
            <div>
              <div className="bg-gradient-to-br from-black to-gray-800 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-6 flex items-center" dir="rtl">
                  <HiBookOpen className="h-6 w-6 ml-2" />
                  𞤀𞤣𞤢𞤲𞤭 𞤃𞤫𞤧𞤫
                </h3>
                
                <div className="space-y-4">
                  {ebooks.length > 0 ? (
                    ebooks.slice(0, 3).map((ebook) => (
                      <Link
                        key={ebook._id}
                        to={`/ebooks/${ebook.slug}`}
                        className="block p-4 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                        dir="rtl"
                      >
                        <h4 className="font-medium text-white line-clamp-2 mb-2">
                          {ebook.title}
                        </h4>
                        <p className="text-white/70 text-sm">
                          {ebook.author}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8" dir="rtl">
                      <HiBookOpen className="h-12 w-12 text-white/30 mx-auto mb-2" />
                      <p className="text-white/50 text-sm">𞤅𞤢𞤲𞤣𞤭 𞤃𞤫𞤧𞤫</p>
                    </div>
                  )}
                </div>
                
                <Link
                  to="/ebooks"
                  className="inline-flex items-center mt-6 text-white hover:text-gray-300 transition-colors font-medium"
                >
                  <span className="ml-2">𞤴𞤮𞤲𞤢𞤲 𞤃𞤫𞤧𞤫 𞤊𞤮𞤪𞤪𞤫</span>
                  <HiArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
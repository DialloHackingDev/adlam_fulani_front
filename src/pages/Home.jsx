import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiNewspaper, 
  HiBookOpen, 
  HiArrowRight,
  HiStar,
  HiEye,
  HiChevronRight
} from 'react-icons/hi';
import HeroBanner from '../components/HeroBanner';
import ArticleCard from '../components/ArticleCard';
import Footer from '../components/Footer';
import { apiService } from '../services/apiService';

const Home = () => {
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalEbooks: 0,
    totalReads: 0
  });

  const quickLinks = [
    { title: '𞤃𞤢𞤦𞤢𞤤𞤫', desc: '𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤃𞤢𞤦𞤢𞤤𞤫', path: '/articles', icon: HiNewspaper, color: 'bg-blue-500' },
    { title: '𞤃𞤫𞤧𞤫', desc: '𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤃𞤫𞤧𞤫', path: '/ebooks', icon: HiBookOpen, color: 'bg-green-500' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [allResponse, featuredResponse, recentResponse, ebooksResponse] = await Promise.allSettled([
          apiService.articles.getAll({ limit: 50 }),
          apiService.articles.getFeatured(3),
          apiService.articles.getRecent(6),
          apiService.ebooks.getRecent(3)
        ]);
        
        const allArticles = allResponse.status === 'fulfilled' 
          ? (allResponse.value?.data?.data?.articles || allResponse.value?.data?.articles || [])
          : [];
          
        const featured = featuredResponse.status === 'fulfilled'
          ? (featuredResponse.value?.data?.data?.articles || featuredResponse.value?.data?.articles || [])
          : [];
          
        const recent = recentResponse.status === 'fulfilled'
          ? (recentResponse.value?.data?.data?.articles || recentResponse.value?.data?.articles || [])
          : [];
          
        const ebooks = ebooksResponse.status === 'fulfilled'
          ? (ebooksResponse.value?.data?.data?.ebooks || ebooksResponse.value?.data?.ebooks || [])
          : [];
        
        // Use recent articles as featured if no featured articles exist
        // If no recent articles, use any available articles
        let finalFeatured = featured.length > 0 ? featured : recent.slice(0, 3);
        if (finalFeatured.length === 0 && allArticles.length > 0) {
          finalFeatured = allArticles.slice(0, 3);
        }
        
        // Use all articles as recent if no recent articles
        let finalRecent = recent.length > 0 ? recent : allArticles.slice(0, 6);
        
        setFeaturedArticles(finalFeatured);
        setRecentArticles(finalRecent);
        setEbooks(ebooks);
        
        const totalViews = allArticles.reduce((sum, article) => sum + (article.views || 0), 0);
        const totalLikes = allArticles.reduce((sum, article) => sum + (article.likes || 0), 0);
        
        setStats({
          totalArticles: allArticles.length,
          totalEbooks: ebooks.length,
          totalReads: totalViews + totalLikes
        });
        
        
      } catch (error) {
        setStats({ totalArticles: 0, totalEbooks: 0, totalReads: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Stats Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors">
                <HiNewspaper className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">{stats.totalArticles}</h3>
              <p className="text-sm sm:text-base text-gray-600" dir="rtl">𞤃𞤢𞤦𞤢𞤤𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4 group-hover:bg-green-200 transition-colors">
                <HiBookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">{stats.totalEbooks}</h3>
              <p className="text-sm sm:text-base text-gray-600" dir="rtl">𞤃𞤫𞤧𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫</p>
            </div>
            <div className="text-center group">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-full mb-3 sm:mb-4 group-hover:bg-purple-200 transition-colors">
                <HiEye className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-black mb-1 sm:mb-2">{stats.totalReads.toLocaleString()}</h3>
              <p className="text-sm sm:text-base text-gray-600" dir="rtl">𞤴𞤮𞤲𞤢𞤲 𞤊𞤮𞤪𞤪𞤫</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12" dir="rtl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4">𞤐𞤢𞤾𞤭𞤺𞤢𞤧𞤭𞤴𞤮𞤲 𞤊𞤢𞤪𞤭</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg px-4">
              𞤅𞤵𞤦𞤮 𞤫 𞤊𞤮𞤲𞤣𞤭 𞤃𞤢𞤳 𞤸𞤢𞤤𞤢𞤲 𞤫 𞤅𞤢𞤭𞤼 𞤲𞤣𞤫𞤲
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto">
            {quickLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <Link
                  key={index}
                  to={link.path}
                  className="group bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
                >
                  <div className="p-6 sm:p-8 text-center">
                    <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 ${link.color} rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3" dir="rtl">{link.title}</h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base" dir="rtl">{link.desc}</p>
                    <div className="flex items-center justify-center text-gray-400 group-hover:text-black transition-colors">
                      <HiArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Articles Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 sm:mb-12" dir="rtl">
            <div className="mb-4 sm:mb-0">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-2 sm:mb-4">𞤃𞤢𞤦𞤢𞤤𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫</h2>
              <p className="text-gray-600 text-sm sm:text-base lg:text-lg">𞤃𞤢𞤦𞤢𞤤𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤𞤢𞤲 𞤫 𞤅𞤢𞤭𞤼 𞤲𞤣𞤫𞤲</p>
            </div>
            <Link
              to="/articles"
              className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
            >
              <span className="mr-2" dir="rtl">𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤊𞤮𞤪𞤪𞤫</span>
              <HiChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-40 sm:h-48 rounded-lg mb-4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : featuredArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {featuredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <HiNewspaper className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-2" dir="rtl">𞤀𞤤𞤢 𞤃𞤢𞤦𞤢𞤤𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫</h3>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-4" dir="rtl">𞤃𞤢𞤦𞤢𞤤𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫 𞤸𞤢𞤤𞤢 𞤱𞤮𞤲𞤢𞤲𞤭</p>
              <Link
                to="/admin"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                <span dir="rtl">𞤅𞤮𞤧𞤢𞤲 𞤃𞤢𞤦𞤢𞤤</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Recent Articles Section */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12" dir="rtl">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4">𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫</h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-base sm:text-lg px-4">
              𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤅𞤢𞤲𞤣𞤭𞤣𞤢𞤲 𞤕𞤮𞤤𞤢𞤲𞤭 𞤫 𞤀𞤣𞤤𞤢𞤥
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse rounded-xl sm:rounded-2xl">
                  <div className="aspect-video bg-gray-200 rounded-t-xl sm:rounded-t-2xl"></div>
                  <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 sm:h-6 bg-gray-200 rounded"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentArticles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {recentArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16">
              <HiNewspaper className="h-12 w-12 sm:h-16 sm:w-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-500 mb-2" dir="rtl">𞤅𞤢𞤲𞤣𞤭 𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫</h3>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-4" dir="rtl">𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫</p>
              <Link
                to="/admin"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                <span dir="rtl">𞤅𞤮𞤧𞤢𞤲 𞤃𞤢𞤦𞤢𞤤</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* E-books Section */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-black to-gray-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8" dir="rtl">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 flex items-center">
                  <HiBookOpen className="h-6 w-6 sm:h-8 sm:w-8 ml-2 sm:ml-3" />
                  𞤀𞤣𞤢𞤲𞤭 𞤃𞤫𞤧𞤫
                </h3>
                <p className="text-gray-300 text-sm sm:text-base">𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤃𞤫𞤧𞤫 𞤫 𞤀𞤣𞤤𞤢𞤥</p>
              </div>
              <Link
                to="/ebooks"
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base"
              >
                <span className="mr-2" dir="rtl">𞤴𞤮𞤲𞤢𞤲 𞤊𞤮𞤪𞤪𞤫</span>
                <HiArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse p-4 sm:p-6 bg-white/10 rounded-xl">
                    <div className="h-3 sm:h-4 bg-white/20 rounded mb-2 sm:mb-3"></div>
                    <div className="h-4 sm:h-6 bg-white/20 rounded mb-1 sm:mb-2"></div>
                    <div className="h-3 sm:h-4 bg-white/20 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            ) : ebooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {ebooks.map((ebook) => (
                  <Link
                    key={ebook._id}
                    to={`/ebooks/${ebook.slug}`}
                    className="block p-4 sm:p-6 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                    dir="rtl"
                  >
                    <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse mb-2 sm:mb-3">
                      <HiStar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
                      <span className="text-xs sm:text-sm text-gray-300">𞤃𞤫𞤧𞤮 𞤑𞤫𞤧𞤢𞤲𞤣𞤮</span>
                    </div>
                    <h4 className="font-bold text-white line-clamp-2 mb-1 sm:mb-2 text-sm sm:text-base">
                      {ebook.title}
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm">
                      {ebook.author || '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤀𞤣𞤤𞤢𞤥'}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-12" dir="rtl">
                <HiBookOpen className="h-12 w-12 sm:h-16 sm:w-16 text-white/30 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">𞤅𞤢𞤲𞤣𞤭 𞤃𞤫𞤧𞤫</h3>
                <p className="text-white/50 text-sm mb-4 sm:mb-6">𞤃𞤫𞤧𞤫 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫</p>
                <Link
                  to="/admin"
                  className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors font-medium text-sm sm:text-base"
                >
                  <span dir="rtl">𞤅𞤮𞤧𞤢𞤲 𞤃𞤫𞤧𞤮</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
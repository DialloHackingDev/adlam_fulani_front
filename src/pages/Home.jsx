import { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import ArticleCard from '../components/ArticleCard';
import { articlesAPI } from '../services/api';

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '𞤊𞤮𞤪𞤪𞤫 𞤃𞤢𞤦𞤢𞤤𞤫' },
    { id: 'literature', name: '𞤀𞤣𞤢𞤦𞤢𞤲' },
    { id: 'history', name: '𞤚𞤢𞤪𞤭𞤲𞤢𞤤' },
    { id: 'education', name: '𞤔𞤢𞤲𞤺𞤢𞤤' },
    { id: 'culture', name: '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤' },
    { id: 'science', name: '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭' },
    { id: 'religion', name: '𞤄𞤭𞤲𞤢𞤤' },
  ];

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const [allResponse, recentResponse] = await Promise.all([
          articlesAPI.getAll(),
          articlesAPI.getRecent()
        ]);
        
        setArticles(allResponse.data.articles || []);
        setRecentArticles(recentResponse.data.articles || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Banner */}
      <HeroBanner />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Recent Articles Section */}
        <section className="mb-16">
          <div className="text-center mb-8" dir="rtl">
            <h2 className="text-3xl font-bold text-black mb-4">𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤀𞤣𞤢𞤲𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤅𞤢𞤲𞤣𞤭𞤣𞤢𞤲 𞤕𞤮𞤤𞤢𞤲𞤭 𞤫 𞤀𞤣𞤤𞤢𞤥
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
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
              {recentArticles.slice(0, 6).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}
        </section>

        {/* Articles by Category Section */}
        <section>
          <div className="text-center mb-8" dir="rtl">
            <h2 className="text-3xl font-bold text-black mb-4">𞤅𞤢𞤦𞤼𞤮 𞤫 𞤊𞤮𞤲𞤣𞤭</h2>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8" dir="rtl">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="bg-gray-100 animate-pulse">
                  <div className="aspect-video bg-gray-200"></div>
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
              {filteredArticles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          )}

          {filteredArticles.length === 0 && !loading && (
            <div className="text-center py-12" dir="rtl">
              <p className="text-gray-500">𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤊𞤮𞤲𞤣𞤭 𞤫𞤲𞤭</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
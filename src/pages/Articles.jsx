import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import ArticlesBanner from '../components/ArticlesBanner';
import { apiService } from '../services/apiService';

const Articles = () => {
  const [articles, setArticles] = useState([]);
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
        let response;
        if (selectedCategory === 'all') {
          response = await apiService.articles.getAll();
        } else {
          response = await apiService.articles.getByCategory(selectedCategory);
        }
        setArticles(response.data.data?.articles || []);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Slider */}
      <ArticlesBanner />
      
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
          <div className="text-center" dir="rtl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3 sm:mb-4">📰 𞤃𞤢𞤦𞤢𞤤𞤫</h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
              𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤊𞤮𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤫 𞤔𞤢𞤲𞤺𞤢𞤤 𞤫 𞤕𞤮𞤤𞤢𞤲𞤭
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-6 sm:mb-8 px-2" dir="rtl">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors duration-200 rounded-lg ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse rounded-lg overflow-hidden">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-4 sm:p-6 space-y-3">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-5 sm:h-6 bg-gray-200 rounded"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12 px-4" dir="rtl">
            <div className="text-gray-400 text-4xl sm:text-6xl mb-4">📰</div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤊𞤮𞤲𞤣𞤭 𞤫𞤲𞤭
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              𞤅𞤢𞤲𞤣𞤭 𞤪𞤭𞤮𞤲𞤭𞤲𞤢𞤤 𞤫 𞤪𞤢𞤲𞤭 𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤫𞤲𞤭
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
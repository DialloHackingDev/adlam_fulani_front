import { useState, useEffect } from 'react';
import ArticleCard from '../components/ArticleCard';
import { articlesAPI } from '../services/api';

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
          response = await articlesAPI.getAll();
        } else {
          response = await articlesAPI.getByCategory(selectedCategory);
        }
        setArticles(response.data.articles || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center" dir="rtl">
            <h1 className="text-3xl font-bold text-black mb-4">📰 𞤃𞤢𞤦𞤢𞤤𞤫</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤊𞤮𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤫 𞤔𞤢𞤲𞤺𞤢𞤤 𞤫 𞤕𞤮𞤤𞤢𞤲𞤭
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article._id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12" dir="rtl">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              𞤅𞤢𞤲𞤣𞤭 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤊𞤮𞤲𞤣𞤭 𞤫𞤲𞤭
            </h3>
            <p className="text-gray-500">
              𞤅𞤢𞤲𞤣𞤭 𞤪𞤭𞤮𞤲𞤭𞤲𞤢𞤤 𞤫 𞤪𞤢𞤲𞤭 𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤫𞤲𞤭
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
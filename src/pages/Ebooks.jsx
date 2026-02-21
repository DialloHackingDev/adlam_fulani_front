import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiBookOpen, 
  HiSearch, 
  HiFilter,
  HiStar,
  HiTrendingUp,
  HiClock,
  HiEye,
  HiChevronDown
} from 'react-icons/hi';
import EbookCard from '../components/EbookCard';
import EbooksBanner from '../components/EbooksBanner';
import { apiService } from '../services/apiService';
import { useAuth } from '../context/AuthContext';

const Ebooks = () => {
  const { user } = useAuth();
  const [ebooks, setEbooks] = useState([]);
  const [featuredEbooks, setFeaturedEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'all', name: '𞤊𞤮𞤪𞤪𞤫 𞤃𞤫𞤧𞤫', count: 0 },
    { id: 'litterature', name: '𞤀𞤣𞤢𞤦𞤢𞤲', count: 0 },
    { id: 'histoire', name: '𞤚𞤢𞤪𞤭𞤲𞤢𞤤', count: 0 },
    { id: 'education', name: '𞤔𞤢𞤲𞤺𞤢𞤤', count: 0 },
    { id: 'culture', name: '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤', count: 0 },
    { id: 'science', name: '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭', count: 0 },
    { id: 'religion', name: '𞤄𞤭𞤲𞤢𞤤', count: 0 }
  ];

  const sortOptions = [
    { id: 'recent', name: '𞤀𞤣𞤢𞤲𞤭', icon: HiClock },
    { id: 'popular', name: '𞤃𞤢𞤧𞤸𞤵𞤪𞤫', icon: HiTrendingUp },
    { id: 'rating', name: '𞤀𞤪𞤣𞤫', icon: HiStar },
    { id: 'price-low', name: '𞤐𞤢𞤤𞤢 𞤬𞤫𞤱𞤲𞤣𞤫', icon: null },
    { id: 'price-high', name: '𞤐𞤢𞤤𞤢 𞤦𞤮𞤲𞤢𞤲𞤣𞤫', icon: null }
  ];

  useEffect(() => {
    fetchEbooks();
  }, [selectedCategory, sortBy]);

  const fetchEbooks = async () => {
    try {
      setLoading(true);
      
      const [allResponse, featuredResponse] = await Promise.allSettled([
        apiService.ebooks.getAll({ 
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          sort: sortBy,
          limit: 50 
        }),
        apiService.ebooks.getFeatured(6)
      ]);

      const allEbooks = allResponse.status === 'fulfilled' 
        ? (allResponse.value.data.data?.ebooks || allResponse.value.data.ebooks || [])
        : [];
        
      const featured = featuredResponse.status === 'fulfilled'
        ? (featuredResponse.value.data.data?.ebooks || featuredResponse.value.data.ebooks || [])
        : [];

      setEbooks(allEbooks);
      setFeaturedEbooks(featured);
      
    } catch (error) {
      console.error('❌ Error fetching ebooks:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEbooks = ebooks.filter(ebook => {
    // Exclure les ebooks featured de la liste principale
    const isFeatured = featuredEbooks.some(featured => featured._id === ebook._id);
    if (isFeatured) return false;
    
    // Filtrer par recherche
    return ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ebook.author?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Banner Slider */}
      <EbooksBanner />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center" dir="rtl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              𞤃𞤫𞤧𞤫 𞤀𞤣𞤤𞤢𞤥
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤃𞤫𞤧𞤫 𞤫 𞤀𞤣𞤤𞤢𞤥 𞤫 𞤔𞤢𞤲𞤺𞤮𞤤 𞤊𞤵𞤤𞤢𞤪
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <HiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
                <input
                  type="text"
                  placeholder="𞤧𞤵𞤦𞤮 𞤃𞤫𞤧𞤮 𞤥𞤢𞤦𞤮 𞤧𞤢𞤲𞤣𞤭𞤲𞤢𞤤..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-4 pr-12 pl-6 text-black rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/20"
                  dir="rtl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Ebooks */}
      {featuredEbooks.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12" dir="rtl">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  𞤃𞤫𞤧𞤫 𞤑𞤫𞤧𞤢𞤲𞤣𞤫
                </h2>
                <p className="text-gray-600 text-lg">
                  𞤃𞤫𞤧𞤫 𞤃𞤢𞤳 𞤸𞤢𞤤𞤢𞤲 𞤫 𞤅𞤢𞤭𞤼 𞤲𞤣𞤫𞤲
                </p>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <HiStar className="h-6 w-6 text-yellow-500" />
                <span className="text-sm text-gray-600">𞤑𞤫𞤧𞤢𞤲𞤣𞤫</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredEbooks.map((ebook) => (
                <EbookCard key={ebook._id} ebook={ebook} featured />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filters and Sort */}
      <section className="py-8 bg-gray-50 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            {/* Categories */}
            <div className="flex flex-wrap gap-3" dir="rtl">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-black text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <span className="text-sm text-gray-600" dir="rtl">𞤪𞤢𞤦𞤢𞤲:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  dir="rtl"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
                <HiChevronDown className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEbooks.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-8" dir="rtl">
                <h3 className="text-2xl font-bold text-black">
                  {selectedCategory === 'all' ? '𞤊𞤮𞤪𞤪𞤫 𞤃𞤫𞤧𞤫' : categories.find(c => c.id === selectedCategory)?.name}
                </h3>
                <span className="text-gray-600">
                  {filteredEbooks.length} 𞤃𞤫𞤧𞤮
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredEbooks.map((ebook) => (
                  <EbookCard key={ebook._id} ebook={ebook} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <HiBookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-500 mb-2" dir="rtl">
                𞤀𞤤𞤢 𞤃𞤫𞤧𞤫 𞤧𞤢𞤦𞤢𞤲𞤢𞤲
              </h3>
              <p className="text-gray-400" dir="rtl">
                {searchTerm ? '𞤧𞤵𞤦𞤮 𞤺𞤮𞤤𞤤𞤮 𞤧𞤢𞤦𞤢𞤲𞤢𞤲' : '𞤃𞤫𞤧𞤫 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫'}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center" dir="rtl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫 𞤃𞤫𞤧𞤮 𞤃𞤢𞤦𞤮?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤀𞤥𞤫𞤲 𞤫 𞤧𞤢𞤦𞤼𞤮 𞤃𞤫𞤧𞤮 𞤃𞤢𞤦𞤮
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤀𞤥𞤫𞤲
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Ebooks;
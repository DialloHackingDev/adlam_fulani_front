import { useState, useEffect } from 'react';
import { HiSearch, HiFilter } from 'react-icons/hi';
import EbookCard from '../components/EbookCard';
import { apiService } from '../services/apiService';

const Library = () => {
  const [ebooks, setEbooks] = useState([]);
  const [filteredEbooks, setFilteredEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    { id: 'all', name: '𞤊𞤮𞤪𞤪𞤫 𞤄𞤭𞤶𞤭𞤣𞤢𞤲𞤭' },
    { id: 'literature', name: '𞤀𞤣𞤢𞤦𞤢𞤲' },
    { id: 'history', name: '𞤚𞤢𞤪𞤭𞤲𞤢𞤤' },
    { id: 'education', name: '𞤔𞤢𞤲𞤺𞤢𞤤' },
    { id: 'culture', name: '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤' },
    { id: 'science', name: '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭' },
    { id: 'religion', name: '𞤄𞤭𞤲𞤢𞤤' },
  ];

  const sortOptions = [
    { id: 'newest', name: '𞤀𞤣𞤢𞤲𞤭' },
    { id: 'oldest', name: '𞤀𞤪𞤭𞤣𞤢𞤲𞤭' },
    { id: 'price-low', name: '𞤅𞤢𞤲𞤪𞤭: 𞤫 𞤢𞤪𞤭𞤣𞤢𞤲𞤭 𞤫 𞤢𞤪𞤭𞤣𞤢𞤲𞤭' },
    { id: 'price-high', name: '𞤅𞤢𞤲𞤪𞤭: 𞤫 𞤢𞤪𞤭𞤣𞤢𞤲𞤭 𞤫 𞤢𞤪𞤭𞤣𞤢𞤲𞤭' },
    { id: 'popular', name: '𞤀𞤪𞤭𞤣𞤢𞤲𞤭 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤' },
  ];

  useEffect(() => {
    const fetchEbooks = async () => {
      try {
        setLoading(true);
        const response = await apiService.ebooks.getAll();
        setEbooks(response.data.data?.ebooks || []);
        setFilteredEbooks(response.data.data?.ebooks || []);
      } catch (error) {
        console.error('Error fetching ebooks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEbooks();
  }, []);

  useEffect(() => {
    let filtered = [...ebooks];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(ebook =>
        ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ebook.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(ebook => ebook.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(ebook => 
      ebook.price >= priceRange[0] && ebook.price <= priceRange[1]
    );

    // Sort
    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0));
        break;
      default:
        break;
    }

    setFilteredEbooks(filtered);
  }, [ebooks, searchTerm, selectedCategory, priceRange, sortBy]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center" dir="rtl">
            <h1 className="text-3xl font-bold text-black mb-4">📚 𞤔𞤢𞤲𞤺𞤮𞤤 𞤄𞤭𞤶𞤭𞤣𞤢𞤲𞤭</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              𞤑𞤮𞤲𞤣𞤭𞤣𞤢𞤲 𞤊𞤮𞤲𞤣𞤭 𞤄𞤭𞤶𞤭𞤣𞤢𞤲𞤭 𞤣𞤫𞤬𞤼𞤫 𞤫 𞤕𞤮𞤤𞤢𞤲𞤭 𞤫 𞤀𞤣𞤤𞤢𞤥
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white border border-gray-200 p-6 sticky top-24" dir="rtl">
              <h3 className="text-lg font-bold text-black mb-4 flex items-center">
                <HiFilter className="ml-2" />
                𞤊𞤭𞤤𞤢𞤪𞤭
              </h3>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  𞤅𞤢𞤦𞤼𞤮
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="𞤧𞤢𞤦𞤼𞤮 𞤫 𞤊𞤮𞤲𞤣𞤫 𞤫 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤..."
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                    dir="rtl"
                  />
                  <HiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  𞤊𞤮𞤲𞤣𞤭
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                  dir="rtl"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  𞤅𞤢𞤲𞤪𞤭 𞤅𞤢𞤲𞤪𞤭
                </label>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>0 GNF</span>
                    <span>{formatPrice(priceRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  𞤅𞤢𞤲𞤼𞤭𞤣𞤢𞤲 𞤫
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                  dir="rtl"
                >
                  {sortOptions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6" dir="rtl">
              <div className="text-gray-600">
                {loading ? '𞤔𞤢𞤲𞤭 𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤...' : `${filteredEbooks.length} 𞤣𞤫𞤬𞤼𞤮`}
              </div>
            </div>

            {/* Books Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-gray-100 animate-pulse">
                    <div className="aspect-[3/4] bg-gray-200"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEbooks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEbooks.map((ebook) => (
                  <EbookCard key={ebook._id} ebook={ebook} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12" dir="rtl">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  𞤅𞤢𞤲𞤣𞤭 𞤣𞤫𞤬𞤼𞤫 𞤅𞤢𞤲𞤪𞤭𞤲𞤢𞤲𞤭
                </h3>
                <p className="text-gray-500">
                  𞤔𞤢𞤲𞤭 𞤪𞤭𞤮𞤲𞤭𞤲𞤢𞤤 𞤅𞤢𞤦𞤼𞤮 𞤮 𞤊𞤭𞤤𞤢𞤪𞤭
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
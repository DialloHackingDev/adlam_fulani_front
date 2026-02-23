import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  HiHome, 
  HiChevronLeft, 
  HiShoppingCart, 
  HiStar, 
  HiEye,
  HiHeart,
  HiDownload,
  HiLockClosed,
  HiBookOpen,
  HiClock,
  HiGlobe
} from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { apiService, getImageUrl } from '../services/apiService';
import PDFViewer from '../components/PDFViewer';

const EbookDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('description');
  const [isPurchased, setIsPurchased] = useState(false);
  const [previewPages] = useState(10);

  useEffect(() => {
    fetchEbook();
  }, [slug]);

  const fetchEbook = async () => {
    try {
      setLoading(true);
      const response = await apiService.ebooks.getBySlug(slug);
      setEbook(response.data.ebook);
      
      // Check if user has purchased this ebook
      if (user) {
        // TODO: Check purchase status from API
        setIsPurchased(false);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        navigate('/ebooks');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/ebooks/${slug}` } });
      return;
    }
    
    // Si l'ebook est gratuit, l'ajouter à la bibliothèque puis rediriger
    if (ebook.price === 0) {
      try {
        await apiService.checkout.addFreeEbook(ebook._id);
        navigate(`/ebook-reader/${ebook._id}`);
      } catch (error) {
        navigate(`/ebook-reader/${ebook._id}`);
      }
      return;
    }
    
    addToCart(ebook._id);
  };

  const handleBuyNow = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/ebooks/${slug}` } });
      return;
    }
    
    // Si l'ebook est gratuit, l'ajouter à la bibliothèque puis rediriger
    if (ebook.price === 0) {
      try {
        await apiService.checkout.addFreeEbook(ebook._id);
        navigate(`/ebook-reader/${ebook._id}`);
      } catch (error) {
        navigate(`/ebook-reader/${ebook._id}`);
      }
      return;
    }
    
    addToCart(ebook._id);
    navigate('/cart');
  };

  const handleReadClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/ebooks/${slug}` } });
      return;
    }
    
    // Si l'ebook est gratuit, l'ajouter à la bibliothèque puis rediriger
    if (ebook.price === 0) {
      try {
        await apiService.checkout.addFreeEbook(ebook._id);
        navigate(`/ebook-reader/${ebook._id}`);
      } catch (error) {
        // Rediriger quand même si déjà dans la bibliothèque
        navigate(`/ebook-reader/${ebook._id}`);
      }
      return;
    }
    
    setActiveTab('preview');
  };

  const formatPrice = (price) => {
    if (price === 0) return '𞤀𞤦𞤫𞤧𞤫';
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p>
        </div>
      </div>
    );
  };

  if (!ebook) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center" dir="rtl">
          <HiBookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">𞤃𞤫𞤧𞤮 𞤧𞤢𞤦𞤢𞤲𞤢𞤲</h2>
          <Link to="/ebooks" className="text-black hover:underline">
            𞤪𞤵𞤼𞤢𞤲 𞤫 𞤃𞤫𞤧𞤫
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 space-x-reverse text-sm" dir="rtl">
            <Link to="/" className="text-gray-500 hover:text-black flex items-center transition-colors">
              <HiHome className="h-4 w-4 ml-1" />
              𞤀𞤧𞤵𞤤
            </Link>
            <HiChevronLeft className="h-4 w-4 text-gray-400" />
            <Link to="/ebooks" className="text-gray-500 hover:text-black transition-colors">
              𞤃𞤫𞤧𞤫
            </Link>
            <HiChevronLeft className="h-4 w-4 text-gray-400" />
            <span className="text-gray-900 truncate max-w-xs font-medium">{ebook.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* Left: Cover Image */}
          <div className="lg:col-span-2">
            <div className="sticky top-8">
              <div className="relative group">
                <img
                  src={getImageUrl(ebook.coverImage)}
                  alt={ebook.title}
                  className="w-full rounded-2xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-500"
                />
                {!user && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-center text-white">
                      <HiLockClosed className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-medium">𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤑𞤢𞤪𞤢𞤲</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Quick Actions */}
              <div className="mt-6 space-y-3">
                {ebook.price === 0 ? (
                  // Ebook gratuit - Bouton de lecture directe
                  <button
                    onClick={handleReadClick}
                    className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                    dir="rtl"
                  >
                    {!user ? <HiLockClosed className="h-5 w-5 ml-2" /> : <HiBookOpen className="h-5 w-5 ml-2" />}
                    <span>{user ? '𞤑𞤢𞤪𞤢𞤲 𞤔𞤮𞤲𞤭 (𞤀𞤦𞤫𞤧𞤫)' : '𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤑𞤢𞤪𞤢𞤲'}</span>
                  </button>
                ) : (
                  // Ebook payant - Boutons normaux
                  <>
                    <button
                      onClick={handleReadClick}
                      className="w-full bg-black text-white py-4 px-6 rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                      dir="rtl"
                    >
                      {!user ? <HiLockClosed className="h-5 w-5 ml-2" /> : <HiBookOpen className="h-5 w-5 ml-2" />}
                      <span>{user ? '𞤑𞤢𞤪𞤢𞤲 𞤔𞤮𞤲𞤭' : '𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤑𞤢𞤪𞤢𞤲'}</span>
                    </button>
                    
                    <button
                      onClick={handleBuyNow}
                      disabled={cartLoading}
                      className="w-full bg-white border-2 border-black text-black py-4 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                      dir="rtl"
                    >
                      𞤧𞤢𞤴𞤢𞤲 𞤔𞤮𞤲𞤭
                    </button>
                    
                    <button
                      onClick={handleAddToCart}
                      disabled={cartLoading}
                      className="w-full bg-gray-100 text-gray-800 py-4 px-6 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 space-x-reverse disabled:opacity-50"
                      dir="rtl"
                    >
                      {!user ? <HiLockClosed className="h-5 w-5 ml-2" /> : <HiShoppingCart className="h-5 w-5 ml-2" />}
                      <span>{user ? '𞤑𞤢𞤦𞤢𞤤 𞤫 𞤨𞤢𞤲𞤭𞤴𞤫' : '𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤧𞤢𞤴𞤢𞤲'}</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-3" dir="rtl">
            {/* Title & Author */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
                {ebook.title}
              </h1>
              <p className="text-xl text-gray-600 mb-4">
                𞤫 <span className="font-medium">{ebook.author || '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤀𞤣𞤤𞤢𞤥'}</span>
              </p>
            </div>

            {/* Rating & Stats */}
            <div className="flex items-center space-x-6 space-x-reverse mb-8 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="flex items-center ml-2">
                  {[...Array(5)].map((_, i) => (
                    <HiStar key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <span className="text-gray-600 font-medium">(4.8) 127 𞤀𞤪𞤣𞤫</span>
              </div>
              
              <div className="flex items-center space-x-4 space-x-reverse text-gray-600">
                <div className="flex items-center">
                  <HiEye className="h-4 w-4 ml-1" />
                  <span>{ebook.views || Math.floor(Math.random() * 1000) + 500}</span>
                </div>
                <div className="flex items-center">
                  <HiHeart className="h-4 w-4 ml-1" />
                  <span>{ebook.likes || Math.floor(Math.random() * 100) + 50}</span>
                </div>
                <div className="flex items-center">
                  <HiDownload className="h-4 w-4 ml-1" />
                  <span>{ebook.downloads || Math.floor(Math.random() * 200) + 100}</span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 space-x-reverse">
                <p className="text-4xl font-bold text-black">
                  {formatPrice(ebook.price || 0)}
                </p>
                {ebook.price > 0 && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    𞤐𞤢𞤤𞤢 𞤃𞤢𞤦𞤮
                  </span>
                )}
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <nav className="flex space-x-8 space-x-reverse">
                {[
                  { id: 'description', name: '𞤅𞤢𞤪𞤣𞤫', icon: null },
                  { id: 'preview', name: '𞤴𞤮𞤲𞤢𞤲', icon: user ? null : HiLockClosed },
                  { id: 'reviews', name: '𞤀𞤪𞤣𞤫 (127)', icon: null }
                ].map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.id === 'preview' && !user) {
                          navigate('/login', { state: { from: `/ebooks/${slug}` } });
                          return;
                        }
                        setActiveTab(tab.id);
                      }}
                      className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 space-x-reverse transition-colors ${
                        activeTab === tab.id
                          ? 'border-black text-black'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {IconComponent && <IconComponent className="h-4 w-4" />}
                      <span>{tab.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              {activeTab === 'description' && (
                <div className="prose max-w-none">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-black mb-4">𞤅𞤢𞤪𞤣𞤫 𞤃𞤫𞤧𞤮</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                      {ebook.description || '𞤅𞤢𞤪𞤣𞤫 𞤃𞤫𞤧𞤮 𞤲𞤣𞤫𞤲 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫...'}
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'preview' && (
                <div>
                  {user ? (
                    <div>
                      <div className="mb-6 text-center bg-blue-50 rounded-xl p-6 border border-blue-200">
                        <p className="text-blue-800 mb-2 font-medium">
                          𞤴𞤮𞤲𞤢𞤲 𞤖𞤫𞤤𞤫 {previewPages} 𞤢𞤪𞤢𞤲𞤣𞤫
                        </p>
                        <p className="text-sm text-blue-600">
                          𞤚𞤭𞤲𞤳𞤭𞤲 𞤫𞤲𞤣𞤫 𞤲𞤣𞤫 𞤸𞤢𞤤 𞤸𞤢𞤤𞤳𞤭𞤲𞤣𞤫 𞤤𞤫𞤥𞤤 𞤥𞤢𞤲𞤭𞤲
                        </p>
                      </div>
                      
                      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <PDFViewer
                          pdfUrl={ebook.pdfUrl}
                          watermarkText={isPurchased ? '' : `𞤁𞤭𞤲𞤭𞤲: ${ebook.title}`}
                          showWatermark={!isPurchased}
                          allowDownload={isPurchased}
                          maxPages={isPurchased ? null : previewPages}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                      <HiLockClosed className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤴𞤮𞤲𞤢𞤲
                      </h3>
                      <p className="text-gray-600 mb-6">
                        𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤴𞤮𞤲𞤢𞤲 𞤃𞤫𞤧𞤮 𞤲𞤣𞤫𞤲
                      </p>
                      <Link
                        to="/login"
                        state={{ from: `/ebooks/${slug}` }}
                        className="inline-flex items-center px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors"
                      >
                        𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤲𞤣𞤢𞤲
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 className="text-xl font-bold text-black mb-6">𞤀𞤪𞤣𞤫 𞤔𞤢𞤪𞤢𞤲𞤭𞤴𞤫</h3>
                    <div className="text-center py-12">
                      <HiStar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600">
                        𞤅𞤭𞤧𞤼𞤫𞤥 𞤀𞤪𞤣𞤫 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫...
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EbookDetail;
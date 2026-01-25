import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { HiHome, HiChevronLeft, HiShoppingCart, HiStar } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { apiService } from '../services/apiService';
import PDFViewer from '../components/PDFViewer';

const EbookDetail = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
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
        } catch (error) {
            console.error('Error fetching ebook:', error);
            if (error.response?.status === 404) {
                navigate('/library');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(ebook);
        alert('𞤃𞤫𞤧𞤮 𞤳𞤢𞤦𞤢𞤤𞤢𞤲𞤢𞤲 𞤫 𞤨𞤢𞤲𞤭𞤴𞤫!');
    };

    const handleBuyNow = () => {
        addToCart(ebook);
        navigate('/cart');
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
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
                    <p className="text-gray-600">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p>
                </div>
            </div>
        );
    }

    if (!ebook) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center" dir="rtl">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">𞤃𞤫𞤧𞤮 𞤧𞤢𞤦𞤢𞤲𞤢𞤲</h2>
                    <Link to="/library" className="text-black hover:underline">
                        𞤪𞤵𞤼𞤢𞤲 𞤫 𞤃𞤫𞤧𞤫
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Breadcrumb */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 space-x-reverse text-sm" dir="rtl">
                        <Link to="/" className="text-gray-500 hover:text-black flex items-center">
                            <HiHome className="h-4 w-4 ml-1" />
                            𞤀𞤧𞤵𞤤
                        </Link>
                        <HiChevronLeft className="h-4 w-4 text-gray-400" />
                        <Link to="/library" className="text-gray-500 hover:text-black">
                            𞤃𞤫𞤧𞤫
                        </Link>
                        <HiChevronLeft className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 truncate max-w-xs">{ebook.title}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: Cover Image */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <img
                                src={ebook.coverImage || '/placeholder-book.jpg'}
                                alt={ebook.title}
                                className="w-full rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="lg:col-span-2" dir="rtl">
                        {/* Title & Author */}
                        <h1 className="text-4xl font-bold text-black mb-4">
                            {ebook.title}
                        </h1>
                        <p className="text-xl text-gray-600 mb-6">
                            𞤫 {ebook.author}
                        </p>

                        {/* Rating (Placeholder) */}
                        <div className="flex items-center mb-6">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <HiStar key={i} className="h-5 w-5 text-yellow-400" />
                                ))}
                            </div>
                            <span className="mr-2 text-gray-600">(4.5) 24 𞤀𞤪𞤣𞤫</span>
                        </div>

                        {/* Price */}
                        <div className="mb-8">
                            <p className="text-3xl font-bold text-black">
                                {formatPrice(ebook.price)}
                            </p>
                        </div>

                        {/* Metadata */}
                        <div className="bg-gray-50 rounded-lg p-6 mb-8 space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">📄 𞤖𞤫𞤤𞤫</span>
                                <span className="font-medium">{ebook.pages || 150} 𞤖𞤫𞤤𞤫</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">🏷️ 𞤊𞤮𞤪𞤲𞤣𞤫</span>
                                <span className="font-medium">{ebook.category}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">📅 𞤖𞤵𞤦𞤤𞤭𞤧𞤫𞤲</span>
                                <span className="font-medium">{ebook.publishYear || 2025}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">🌐 𞤂𞤢𞤥𞤲𞤺𞤢𞤤</span>
                                <span className="font-medium">𞤊𞤵𞤤𞤢𞤪 (𞤀𞤣𞤤𞤢𞤥)</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 space-x-reverse mb-12">
                            <button
                                onClick={handleBuyNow}
                                className="flex-1 bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                𞤧𞤢𞤴𞤢𞤲 𞤔𞤮𞤲𞤭
                            </button>
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 bg-white border-2 border-black text-black py-4 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                            >
                                <HiShoppingCart className="h-5 w-5 ml-2" />
                                𞤑𞤢𞤦𞤢𞤤 𞤫 𞤨𞤢𞤲𞤭𞤴𞤫
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-200 mb-8">
                            <nav className="flex space-x-8 space-x-reverse">
                                <button
                                    onClick={() => setActiveTab('description')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'description'
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    𞤅𞤢𞤪𞤣𞤫
                                </button>
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'preview'
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    𞤴𞤮𞤲𞤢𞤲
                                </button>
                                <button
                                    onClick={() => setActiveTab('reviews')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reviews'
                                            ? 'border-black text-black'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    𞤀𞤪𞤣𞤫 (24)
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div>
                            {activeTab === 'description' && (
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                        {ebook.description}
                                    </p>
                                </div>
                            )}

                            {activeTab === 'preview' && (
                                <div>
                                    <div className="mb-4 text-center">
                                        <p className="text-gray-600 mb-2">
                                            𞤴𞤮𞤲𞤢𞤲 𞤖𞤫𞤤𞤫 {previewPages} 𞤢𞤪𞤢𞤲𞤣𞤫
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            𞤚𞤭𞤲𞤳𞤭𞥄𞤲 𞤫𞥊𞤲𞤣𞤫 𞤲𞤣𞤫 𞤸𞤢𞤤𞭑 𞤤𞤫𞥄𞤳𞤭𞤲𞤣𞤫 𞤤𞤫𞤥𞤤𞭑 𞤥𞤢𞥄𞤲𞤭𞥄𞤲
                                        </p>
                                    </div>
                                    
                                    <PDFViewer
                                        pdfUrl={ebook.pdfUrl}
                                        watermarkText={isPurchased ? '' : `𞤁𞤭𞤲𞤭𞥄𞤲: ${ebook.title}`}
                                        showWatermark={!isPurchased}
                                        allowDownload={isPurchased}
                                        maxPages={isPurchased ? null : previewPages}
                                    />
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                                        <p className="text-gray-600 text-center">
                                            𞤅𞤭𞤧𞤼𞤫𞤥 𞤀𞤪𞤣𞤫 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫...
                                        </p>
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

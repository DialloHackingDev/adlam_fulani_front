import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiBookOpen, HiDownload, HiEye, HiStar } from 'react-icons/hi';
import { getImageUrl, apiService } from '../services/apiService';

const MyLibrary = () => {
    const navigate = useNavigate();
    const [purchasedEbooks, setPurchasedEbooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPurchasedEbooks();
    }, []);

    const fetchPurchasedEbooks = async () => {
        try {
            setLoading(true);
            const response = await apiService.checkout.getPurchasedEbooks();
            const ebooks = response.data.data?.ebooks || response.data.ebooks || [];
            setPurchasedEbooks(ebooks);
        } catch (error) {
            setPurchasedEbooks([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRead = (ebookId) => {
        navigate(`/ebook-reader/${ebookId}`);
    };

    const handleDownload = async (ebookId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(apiService.ebooks.stream(ebookId), {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (!response.ok) throw new Error('Erreur de téléchargement');
            
            const blob = await response.blob();
            const ebook = purchasedEbooks.find(e => e._id === ebookId);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${ebook?.title || 'ebook'}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            alert('Erreur lors du téléchargement');
        }
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

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-8 sm:py-12">
                {/* Header */}
                <div className="mb-6 sm:mb-8" dir="rtl">
                    <h1 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                        📚 𞤃𞤢 𞤄𞤭𞤦𞤤𞤭𞤮𞤼𞤫𞤳
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600">
                        𞤃𞤫𞤧𞤫 𞤥𞤢𞤢 𞤧𞤢𞤴𞤢𞤲𞤢𞤲𞤺𞤫
                    </p>
                </div>

                {purchasedEbooks.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12 sm:py-16 px-4" dir="rtl">
                        <HiBookOpen className="h-16 w-16 sm:h-24 sm:w-24 text-gray-300 mx-auto mb-4 sm:mb-6" />
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                            𞤄𞤭𞤦𞤤𞤭𞤮𞤼𞤫𞤳 𞤥𞤢𞤢 𞤬𞤫𞤲𞤢𞤲
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
                            𞤀 𞤸𞤢𞤤 𞤧𞤢𞤴𞤢𞤲 𞤃𞤫𞤧𞤮 𞤸𞤢𞤤𞤭. 𞤔𞤮𞤲𞤢𞤲 𞤦𞤵𞤼𞤭𞤳 𞤫𞤲𞤺𞤢𞤥 𞤫 𞤧𞤢𞤴𞤢𞤲 𞤃𞤫𞤧𞤮 𞤢𞤪𞤢𞤲𞤣𞤫.
                        </p>
                        <Link
                            to="/ebooks"
                            className="inline-block bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
                        >
                            𞤔𞤮𞤲𞤢𞤲 𞤄𞤵𞤼𞤭𞤳
                        </Link>
                    </div>
                ) : (
                    /* Ebooks Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {purchasedEbooks.map((ebook) => (
                            <article
                                key={ebook._id}
                                className="group bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 overflow-hidden"
                            >
                                {/* Cover Image */}
                                <div className="aspect-[3/4] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 relative">
                                    {getImageUrl(ebook.coverImage) ? (
                                        <img
                                            src={getImageUrl(ebook.coverImage)}
                                            alt={ebook.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.nextSibling.style.display = 'flex';
                                            }}
                                        />
                                    ) : null}
                                    <div className={`absolute inset-0 flex items-center justify-center text-gray-400 text-sm font-medium ${getImageUrl(ebook.coverImage) ? 'hidden' : 'flex'}`}>
                                        <div className="text-center">
                                            <div className="text-4xl mb-2">📚</div>
                                            <div>𞤐𞤮 𞤸𞤮𞤼𞤮</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6" dir="rtl">
                                    {/* Title */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-gray-700 transition-colors leading-tight">
                                        {ebook.title}
                                    </h3>

                                    {/* Author */}
                                    <p className="text-sm text-gray-600 mb-4 flex items-center">
                                        <span className="ml-1">𞤫</span>
                                        <span className="font-medium">{ebook.author || '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤀𞤣𞤤𞤢𞤥'}</span>
                                    </p>

                                    {/* Rating */}
                                    <div className="flex items-center mb-4">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <HiStar
                                                    key={i}
                                                    className={`h-4 w-4 ${
                                                        i < Math.floor(ebook.rating || 4.5)
                                                            ? 'text-yellow-400'
                                                            : 'text-gray-300'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-2 pt-4 border-t border-gray-100">
                                        <button 
                                            onClick={() => handleRead(ebook._id)}
                                            className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-sm font-medium"
                                        >
                                            <HiEye className="h-4 w-4 ml-2" />
                                            𞤔𞤢𞤲𞤢𞤲
                                        </button>
                                        <button 
                                            onClick={() => handleDownload(ebook._id)}
                                            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm font-medium"
                                        >
                                            <HiDownload className="h-4 w-4 ml-2" />
                                            𞤚𞤫𞤤𞤫𞤧𞤢𞤪𞤶𞤫
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLibrary;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiBookOpen, HiDownload, HiEye } from 'react-icons/hi';

const MyLibrary = () => {
    const [purchasedEbooks, setPurchasedEbooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPurchasedEbooks();
    }, []);

    const fetchPurchasedEbooks = async () => {
        try {
            setLoading(true);
            // TODO: Implémenter l'API pour récupérer les e-books achetés
            // const response = await ebooksAPI.getPurchased();
            // setPurchasedEbooks(response.data.ebooks);

            // Placeholder pour le moment
            setPurchasedEbooks([]);
        } catch (error) {
            console.error('Error fetching purchased ebooks:', error);
        } finally {
            setLoading(false);
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
                            to="/library"
                            className="inline-block bg-black text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm sm:text-base"
                        >
                            𞤔𞤮𞤲𞤢𞤲 𞤄𞤵𞤼𞤭𞤳
                        </Link>
                    </div>
                ) : (
                    /* Ebooks Grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {purchasedEbooks.map((ebook) => (
                            <div
                                key={ebook._id}
                                className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                            >
                                {/* Cover */}
                                <div className="aspect-[3/4] bg-gray-100">
                                    <img
                                        src={ebook.coverImage}
                                        alt={ebook.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-4 sm:p-6" dir="rtl">
                                    <h3 className="text-base sm:text-lg font-bold text-black mb-2 line-clamp-2">
                                        {ebook.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                                        {ebook.author}
                                    </p>

                                    {/* Actions */}
                                    <div className="space-y-2">
                                        <button className="w-full bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-sm sm:text-base">
                                            <HiEye className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                                            𞤔𞤢𞤲𞤢𞤲
                                        </button>
                                        <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center text-sm sm:text-base">
                                            <HiDownload className="h-4 w-4 sm:h-5 sm:w-5 ml-2" />
                                            𞤚𞤫𞤤𞤫𞤧𞤢𞤪𞤶𞤫
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLibrary;

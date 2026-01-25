import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { HiCheckCircle, HiHome, HiBookOpen } from 'react-icons/hi';

const CheckoutSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        // Vider le panier après succès
        localStorage.removeItem('cart');
    }, []);

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center" dir="rtl">
                {/* Success Icon */}
                <div className="mb-8">
                    <HiCheckCircle className="h-24 w-24 text-green-500 mx-auto" />
                </div>

                {/* Title */}
                <h1 className="text-3xl font-bold text-black mb-4">
                    🎉 𞤅𞤢𞤴𞤢𞤲 𞤧𞤫𞤥𞤦𞤭𞤲𞤢𞤲!
                </h1>

                {/* Message */}
                <p className="text-lg text-gray-600 mb-8">
                    𞤅𞤢𞤴𞤢𞤲 𞤥𞤢𞤢 𞤧𞤫𞤥𞤦𞤭𞤲𞤢𞤲 𞤫 𞤸𞤫𞤧𞤮. 𞤀 𞤸𞤫𞤦𞤼𞤢𞤲𞤮 𞤫𞤥𞤢𞤴𞤤 𞤫 𞤳𞤮𞤲𞤬𞤭𞤪𞤥𞤢𞤧𞤭𞤴𞤮𞤲.
                </p>

                {/* Order Info */}
                {sessionId && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8">
                        <p className="text-sm text-gray-600 mb-2">𞤐𞤵𞤥𞤫𞤪𞤮 𞤳𞤮𞤥𞤢𞤲𞤣</p>
                        <p className="text-lg font-mono font-medium text-black">
                            {sessionId.substring(0, 20)}...
                        </p>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <p className="text-sm text-blue-900">
                        ℹ️ 𞤀 𞤸𞤫𞤦𞤼𞤢𞤲𞤮 𞤫𞤥𞤢𞤴𞤤 𞤫 𞤳𞤮𞤲𞤬𞤭𞤪𞤥𞤢𞤧𞤭𞤴𞤮𞤲 𞤫 𞤬𞤢𞤳𞤼𞤵𞤪. 𞤃𞤫𞤧𞤫 𞤥𞤢𞤢 𞤸𞤫𞤦𞤼𞤢𞤲𞤮 𞤫 "𞤃𞤢 𞤄𞤭𞤦𞤤𞤭𞤮𞤼𞤫𞤳".
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link
                        to="/my-library"
                        className="w-full bg-black text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                    >
                        <HiBookOpen className="h-5 w-5 ml-2" />
                        𞤔𞤮𞤲𞤢𞤲 𞤃𞤢 𞤄𞤭𞤦𞤤𞤭𞤮𞤼𞤫𞤳
                    </Link>

                    <Link
                        to="/"
                        className="w-full bg-white border-2 border-gray-300 text-gray-700 py-4 px-6 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                        <HiHome className="h-5 w-5 ml-2" />
                        𞤪𞤵𞤼𞤢𞤲 𞤫 𞤀𞤧𞤵𞤤
                    </Link>
                </div>

                {/* Support Link */}
                <p className="mt-8 text-sm text-gray-500">
                    𞤀 𞤸𞤫𞤦𞤭 𞤦𞤢𞤤𞤤𞤢𞤤?{' '}
                    <Link to="/contact" className="text-black hover:underline">
                        𞤔𞤮𞤲𞤼𞤵 𞤫𞤲𞤺𞤢𞤥
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default CheckoutSuccess;

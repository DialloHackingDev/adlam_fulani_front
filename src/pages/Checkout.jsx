import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiCreditCard, HiLockClosed, HiCheckCircle } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../services/apiService';
import { apiService } from '../services/apiService';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const price = item.ebook?.price || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar', {
      style: 'currency',
      currency: 'GNF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Créer une session de paiement
      const sessionResponse = await apiService.checkout.createSession({});
      const { paymentIntentId } = sessionResponse.data.data;

      // 2. Simuler le paiement (3 secondes)
      await new Promise(resolve => setTimeout(resolve, 3000));

      // 3. Confirmer le paiement
      await apiService.checkout.confirmPayment({ paymentIntentId });

      setProcessing(false);
      setPaymentSuccess(true);
      
      // Vider le panier et rediriger après 2 secondes
      setTimeout(() => {
        clearCart();
        navigate('/my-library');
      }, 2000);
    } catch (error) {
      console.error('Payment error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setProcessing(false);
      alert(`Erreur lors du paiement: ${error.response?.data?.message || error.message}`);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center" dir="rtl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiCheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✅ 𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤!
          </h2>
          <p className="text-gray-600 mb-6">
            𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤪𞤢𞤣𞤢 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤫 𞤣𞤫𞤬𞤼𞤫 𞤪𞤢𞤣𞤢 𞤫 𞤤𞤢𞤴𞤦𞤪𞤢𞤪𞤭 𞤪𞤢𞤣𞤢
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de paiement */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8" dir="rtl">
            <div className="flex items-center space-x-3 space-x-reverse mb-6">
              <HiCreditCard className="h-8 w-8 text-black" />
              <h2 className="text-2xl font-bold">💳 𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤</h2>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              {/* Nom sur la carte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  𞤚𞤢𞤦𞤭 𞤫 𞤑𞤢𞤪𞤼
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤚𞤢𞤦𞤭 𞤪𞤢𞤣𞤢"
                />
              </div>

              {/* Numéro de carte */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  𞤐𞤵𞤥𞤦𞤫𞤪 𞤑𞤢𞤪𞤼
                </label>
                <input
                  type="text"
                  required
                  maxLength="19"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Date d'expiration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    𞤗𞤢𞤼𞤫 𞤊𞤭𞤲𞤢𞤤
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="5"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="MM/YY"
                  />
                </div>

                {/* CVV */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    required
                    maxLength="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="123"
                  />
                </div>
              </div>

              {/* Bouton de paiement */}
              <button
                type="submit"
                disabled={processing}
                className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-4 rounded-xl font-bold hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {processing ? (
                  <span className="flex items-center justify-center space-x-2 space-x-reverse">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</span>
                  </span>
                ) : (
                  `💳 𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 ${formatPrice(calculateTotal())}`
                )}
              </button>

              {/* Sécurité */}
              <div className="flex items-center justify-center space-x-2 space-x-reverse text-sm text-gray-500">
                <HiLockClosed className="h-4 w-4" />
                <span>𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤 256-bit SSL</span>
              </div>
            </form>
          </div>

          {/* Résumé de commande */}
          <div>
            <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 sticky top-24" dir="rtl">
              <h3 className="text-xl font-bold mb-6">📋 𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤪𞤢𞤤</h3>

              <div className="space-y-4 mb-6">
                {items.map((item) => {
                  const ebook = item.ebook || {};
                  const title = ebook.title || item.title || 'Titre';
                  const price = ebook.price || item.price || 0;
                  
                  return (
                    <div key={item._id} className="flex items-center space-x-3 space-x-reverse py-3 border-b border-gray-100">
                      <div className="w-12 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden">
                        {getImageUrl(ebook.coverImage) && (
                          <img src={getImageUrl(ebook.coverImage)} alt={title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2">{title}</p>
                        <p className="text-xs text-gray-500">𞤀𞤣𞤢𞤪𞤭: {item.quantity}</p>
                      </div>
                      <div className="font-bold text-sm">
                        {formatPrice(price * item.quantity)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-3 pt-4 border-t-2 border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">𞤅𞤢𞤪𞤼𞤭𞤪𞤢𞤤 𞤊𞤢𞤪𞤭𞤣𞤢𞤪𞤭:</span>
                  <span className="font-medium">{formatPrice(calculateTotal())}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">𞤚𞤢𞤳𞤧:</span>
                  <span className="font-medium text-green-600">0 GNF</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                  <span>𞤊𞤮𞤼𞤼𞤢𞤪𞤭:</span>
                  <span className="text-black">{formatPrice(calculateTotal())}</span>
                </div>
              </div>

              {/* Badges de confiance */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-600">
                  <span>✅</span>
                  <span>𞤀𞤳𞤧𞤫𞤧 𞤭𞤲𞤧𞤼𞤢𞤲𞤼𞤢𞤲𞤫</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-600">
                  <span>🔒</span>
                  <span>𞤅𞤢𞤪𞤼𞤦𞤢𞤦𞤭𞤪𞤢𞤤 𞤅𞤢𞤪𞤣𞤭𞤲𞤢𞤤</span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse text-xs text-gray-600">
                  <span>💯</span>
                  <span>𞤘𞤢𞤪𞤢𞤲𞤼𞤭 100%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

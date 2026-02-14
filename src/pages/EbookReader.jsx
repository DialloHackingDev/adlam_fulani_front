import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { HiArrowLeft, HiDownload, HiZoomIn, HiZoomOut, HiX } from 'react-icons/hi';
import { apiService } from '../services/apiService';
import PDFViewer from '../components/PDFViewer';

const EbookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEbookAndPdf();
  }, [id]);

  const fetchEbookAndPdf = async () => {
    try {
      setLoading(true);
      
      // Récupérer les infos de l'ebook
      const ebookResponse = await apiService.ebooks.getById(id);
      const ebookData = ebookResponse.data.data?.ebook || ebookResponse.data.ebook || ebookResponse.data;
      setEbook(ebookData);
      
      // Récupérer l'URL de téléchargement sécurisée
      const downloadResponse = await apiService.ebooks.download(id);
      const downloadUrl = downloadResponse.data.data.downloadUrl;
      setPdfUrl(downloadUrl);
      
    } catch (error) {
      console.error('Error fetching ebook:', error);
      if (error.response?.status === 403) {
        setError('Vous n\'avez pas accès à ce livre');
      } else {
        setError('Impossible de charger le livre');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p>
        </div>
      </div>
    );
  }

  if (error || !ebook) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">𞤃𞤫𞤧𞤮 𞤧𞤢𞤦𞤢𞤲𞤢𞤲</h2>
          <p className="mb-6">{error}</p>
          <Link
            to="/my-library"
            className="inline-flex items-center px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
          >
            <HiArrowLeft className="h-5 w-5 ml-2" />
            𞤪𞤵𞤼𞤢𞤲 𞤫 𞤄𞤭𞤦𞤤𞤭𞤮𞤼𞤫𞤳
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse" dir="rtl">
              <button
                onClick={() => navigate('/my-library')}
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
              >
                <HiArrowLeft className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-white line-clamp-1">
                  {ebook.title}
                </h1>
                <p className="text-sm text-gray-400">
                  {ebook.author || '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤 𞤀𞤣𞤤𞤢𞤥'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 space-x-reverse">
              <button
                onClick={() => window.print()}
                className="hidden sm:flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <HiDownload className="h-5 w-5 ml-2" />
                <span>𞤚𞤫𞤤𞤫𞤧𞤢𞤪𞤶𞤫</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          {pdfUrl ? (
            <PDFViewer
              pdfUrl={pdfUrl}
              watermarkText=""
              showWatermark={false}
              allowDownload={true}
              maxPages={null}
            />
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-600 mb-4">𞤊𞤭𞤼𞤢𞤦 𞤧𞤢𞤦𞤢𞤲𞤢𞤲</p>
              <Link
                to="/my-library"
                className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <HiArrowLeft className="h-5 w-5 ml-2" />
                𞤪𞤵𞤼𞤢𞤲
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EbookReader;

import React, { useState, useEffect } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { searchPlugin } from '@react-pdf-viewer/search';
import { HiOutlineZoomIn, HiOutlineZoomOut, HiOutlineDownload, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import axios from 'axios';

// Import CSS
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

const PDFViewer = ({ 
  pdfUrl, 
  watermarkText = '', 
  allowDownload = false, 
  showWatermark = false,
  initialPage = 1,
  maxPages = 10 
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Charger le PDF avec authentification
  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfUrl) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        
        // Vérifier que le token existe
        if (!token) {
          throw new Error('Vous devez être connecté pour accéder à ce livre');
        }
        
        console.log('Token présent:', token ? 'Oui' : 'Non');
        console.log('URL PDF:', pdfUrl);
        
        const response = await axios.get(pdfUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        });

        console.log('Réponse reçue, Content-Type:', response.headers['content-type']);

        // Vérifier que la réponse est bien un PDF
        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/pdf')) {
          // Si ce n'est pas un PDF, c'est probablement une erreur JSON
          const text = await response.data.text();
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || 'Fichier invalide');
          } catch (e) {
            throw new Error('Le fichier reçu n\'est pas un PDF valide');
          }
        }

        const blob = new Blob([response.data], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlob(blobUrl);
      } catch (err) {
        console.error('Erreur chargement PDF:', err);
        if (err.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
          // Rediriger vers login après 2 secondes
          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }, 2000);
        } else if (err.response?.status === 403) {
          setError('Vous n\'avez pas accès à ce livre');
        } else if (err.response?.status === 404) {
          setError('Livre introuvable');
        } else {
          setError(err.message || 'Erreur lors du chargement du PDF');
        }
      } finally {
        setLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (pdfBlob) {
        URL.revokeObjectURL(pdfBlob);
      }
    };
  }, [pdfUrl]);

  // Plugins
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    toolbarPlugin: {
      fullScreenPlugin: {
        onEnterFullscreen: () => setIsFullscreen(true),
        onExitFullscreen: () => setIsFullscreen(false),
      },
    },
  });

  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const searchPluginInstance = searchPlugin();

  // Gestionnaire de changement de page
  const handlePageChange = ({ currentPage }) => {
    setCurrentPage(currentPage);
  };

  // Gestionnaire de zoom
  const handleZoom = (newScale) => {
    setScale(newScale);
  };

  // Watermark component
  const WatermarkOverlay = () => {
    if (!showWatermark || !watermarkText) return null;

    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            transform: 'rotate(-45deg)',
            fontSize: '48px',
            color: 'rgba(0, 0, 0, 0.1)',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            userSelect: 'none',
          }}
        >
          {watermarkText}
        </div>
      </div>
    );
  };

  // Toolbar personnalisée
  const CustomToolbar = () => (
    <div className="flex items-center justify-between p-4 bg-gray-100 border-b border-gray-300" dir="rtl">
      <div className="flex items-center space-x-4 space-x-reverse">
        <span className="text-sm text-gray-600">
          𞤔𞤫𞥄𞤤𞤫 {currentPage}
        </span>
        
        <div className="flex items-center space-x-2 space-x-reverse">
          <button
            onClick={() => handleZoom(scale - 0.1)}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="𞤔𞤭𞤪𞤭𞥄𞤲"
          >
            <HiOutlineZoomOut className="h-4 w-4" />
          </button>
          
          <span className="text-sm text-gray-600 min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          
          <button
            onClick={() => handleZoom(scale + 0.1)}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="𞤈𞤵𞤴𞤢𞥄𞴴"
          >
            <HiOutlineZoomIn className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-2 space-x-reverse">
        {allowDownload && (
          <button
            onClick={() => {
              const link = document.createElement('a');
              link.href = pdfUrl;
              link.download = 'ebook.pdf';
              link.click();
            }}
            className="p-2 rounded hover:bg-gray-200 transition-colors"
            title="𞤁𞤢𞤱𞤣𞤭𞥄𞤲"
          >
            <HiOutlineDownload className="h-4 w-4" />
          </button>
        )}
        
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="p-2 rounded hover:bg-gray-200 transition-colors"
          title={isFullscreen ? '𞤚𞤭𞤪𞤭𞤥𞤢𞥄𞤲' : '𞤑𞤢𞤥𞤢𞥄𞤲𞤭𞥄𞤲'}
        >
          {isFullscreen ? <HiOutlineEyeOff className="h-4 w-4" /> : <HiOutlineEye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤸𞤢𞤤𞤢𞤲
          </button>
        </div>
      </div>
    );
  }

  if (!pdfBlob) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">𞤢𞤬𞤭𞤲 𞤬𞤭𞤤 PDF 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫</p>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-0 z-50 bg-gray-900' 
        : 'relative bg-white rounded-xl shadow-lg overflow-hidden'
    }`}>
      {!isFullscreen && <CustomToolbar />}
      
      <div className={`relative ${
        isFullscreen 
          ? 'h-screen' 
          : 'h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px]'
      }`}>
        <WatermarkOverlay />
        
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfBlob}
            plugins={[
              defaultLayoutPluginInstance,
              zoomPluginInstance,
              pageNavigationPluginInstance,
              searchPluginInstance,
            ]}
            defaultScale={SpecialZoomLevel.PageWidth}
            onPageChange={handlePageChange}
            onZoom={handleZoom}
            initialPage={initialPage - 1}
          />
        </Worker>
      </div>
    </div>
  );
};

export default PDFViewer;ssName="text-sm text-gray-600">
          {maxPages && `𞤀𞤨𞤫𞤪𞤭𞥄𞤲 𞤥𞤢𞤧𞤭𞤣𞤫 - 𞤔𞤫𞥄𞤤𞤫 1-${maxPages} 𞤫𞥊𞤲𞤣𞤫 ${maxPages} 𞤔𞤫𞥄𞤤𞤫`}
        </p>
      </div>
    </div>
  );
};

export default PDFViewer;

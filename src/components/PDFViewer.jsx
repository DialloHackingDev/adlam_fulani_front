import React, { useState } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import { searchPlugin } from '@react-pdf-viewer/search';
import { HiOutlineZoomIn, HiOutlineZoomOut, HiOutlineDownload, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

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

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
        <p className="text-gray-500">𞤢𞤬𞤭𞤲 𞤬𞤭𞤤 PDF 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫</p>
      </div>
    );
  }

  return (
    <div className={`pdf-viewer ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : 'relative'}`}>
      <CustomToolbar />
      
      <div className={`relative ${isFullscreen ? 'h-[calc(100vh-80px)]' : 'h-96 md:h-[600px]'}`}>
        <WatermarkOverlay />
        
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfUrl}
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
            renderPage={(props) => {
              // Limiter le nombre de pages visibles pour l'aperçu
              if (maxPages && props.pageIndex + 1 > maxPages) {
                return (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center p-8">
                      <p className="text-lg font-bold text-gray-700 mb-4">
                        𞤀𞤨𞤫𞤪𞤭𞥄𞤲 𞤥𞤢𞤧𞤭𞤣𞤫
                      </p>
                      <p className="text-gray-600 mb-6">
                        𞤚𞤭𞤲𞤳𞤭𞥄𞤲 𞤫𞥊𞤲𞤣𞤫 𞤲𞤣𞤫 𞤸𞤢𞤤𞤭 𞤤𞤫𞥄𞤳𞤭𞤲𞤣𞤫 𞤤𞤫𞤥𞤤𞤭𞥄𞤲
                      </p>
                      <button
                        onClick={() => {
                          // Rediriger vers la page d'achat
                          window.location.href = '/checkout';
                        }}
                        className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                      >
                        𞤔𞤭𞤲𞤭𞥄𞤲 𞤥𞤢𞥄𞤲𞤭𞥄𞤲
                      </button>
                    </div>
                  </div>
                );
              }
              return props.renderPage();
            }}
          />
        </Worker>
      </div>

      {/* Footer avec informations */}
      <div className="p-4 bg-gray-100 border-t border-gray-300 text-center" dir="rtl">
        <p className="text-sm text-gray-600">
          {maxPages && `𞤀𞤨𞤫𞤪𞤭𞥄𞤲 𞤥𞤢𞤧𞤭𞤣𞤫 - 𞤔𞤫𞥄𞤤𞤫 1-${maxPages} 𞤫𞥊𞤲𞤣𞤫 ${maxPages} 𞤔𞤫𞥄𞤤𞤫`}
        </p>
      </div>
    </div>
  );
};

export default PDFViewer;

import React, { useState, useEffect } from 'react';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import axios from 'axios';

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
  const [pdfBlob, setPdfBlob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        if (!token) {
          throw new Error('Vous devez être connecté pour accéder à ce livre');
        }
        
        const response = await axios.get(pdfUrl, {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'arraybuffer'
        });

        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.includes('application/pdf')) {
          const text = new TextDecoder().decode(response.data);
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
        if (err.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
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

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-700 font-medium">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-gradient-to-br from-red-50 to-gray-100 rounded-2xl">
        <div className="text-center p-8">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-red-600 mb-6 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95"
          >
            𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤸𞤢𞤤𞤢𞤲
          </button>
        </div>
      </div>
    );
  }

  if (!pdfBlob) {
    return (
      <div className="flex items-center justify-center min-h-[500px] bg-gray-100 rounded-2xl">
        <p className="text-gray-500">𞤢𞤬𞤭𞤲 𞤬𞤭𞤤 PDF 𞤸𞤢𞤤 𞤸𞤫𞤧𞤮𞤲𞤣𞤫</p>
      </div>
    );
  }

  return (
    <div className="relative bg-white rounded-lg shadow-xl overflow-hidden">
      {/* Message d'avertissement pour polices Adlam */}
      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-4 m-4 rounded-lg">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="mr-3 flex-1">
            <p className="text-sm font-medium text-yellow-800">
              📝 𞤖𞤮𞤪 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤀𞤣𞤤𞤢𞤥 𞤫 𞤥𞤢𞤴𞤪𞤢𞤲𞤣𞤫
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              𞤲𞤮 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤖𞤮𞤪 𞤥𞤢𞤴𞤪𞤢𞤲𞤣𞤫 𞤀𞤣𞤤𞤢𞤥, 𞤲𞤮𞤲 𞤪𞤮𞤳𞤮𞤥𞤢𞤲𞤣𞤫 𞤚𞤫𞤤𞤫𞤧𞤢𞤪𞤶𞤫 PDF 𞤲𞤣𞤫
            </p>
          </div>
        </div>
      </div>
      
      <div className="h-[600px] sm:h-[700px] md:h-[800px] lg:h-[900px] xl:h-[1000px]">
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl={pdfBlob}
            plugins={[defaultLayoutPluginInstance]}
            defaultScale={SpecialZoomLevel.PageWidth}
            initialPage={initialPage - 1}
          />
        </Worker>
      </div>
    </div>
  );
};

export default PDFViewer;

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
        console.error('Erreur chargement PDF:', err);
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

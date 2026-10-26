import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiService } from '../services/apiService';
import BookReader from '../components/BookReader';
import { saveBook, loadBook } from '../utils/offlineStore';

// Messages adaptés aux erreurs d'accès au fichier
const describeError = (error) => {
  const status = error.response?.status;
  if (status === 401) return 'Votre session a expiré. Reconnectez-vous pour continuer la lecture.';
  if (status === 403) return 'Vous n\'avez pas accès à ce livre. Achetez-le ou ajoutez-le à votre bibliothèque.';
  if (status === 404) return 'Ce livre est introuvable.';
  if (!error.response) return 'Connexion impossible. Vérifiez votre réseau puis réessayez.';
  return 'Impossible d\'ouvrir ce livre.';
};

const EbookReader = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ebook, setEbook] = useState(null);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login', { replace: true, state: { from: `/ebook-reader/${id}` } });
      return;
    }
    apiService.ebooks.getById(id)
      .then(res => setEbook(res.data.data.ebook))
      .catch(() => setEbook({ title: '' }));
  }, [id, navigate]);

  // Télécharge le PDF via l'API (qui vérifie l'achat) en suivant la progression
  const loadPdf = useCallback(async (onProgress) => {
    try {
      const response = await axios.get(apiService.ebooks.stream(id), {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'arraybuffer',
        timeout: 120000,
        onDownloadProgress: (e) => e.total && onProgress(e.loaded / e.total)
      });
      onProgress(1);
      // Copie conservée sur l'appareil pour la lecture hors connexion
      saveBook(id, response.data.slice(0));
      return response.data;
    } catch (error) {
      // Sans réseau : lire la copie locale si le livre a déjà été ouvert
      if (!error.response) {
        const offlineCopy = await loadBook(id);
        if (offlineCopy) {
          onProgress(1);
          return offlineCopy;
        }
        error.userMessage = 'Ce livre n\'est pas encore disponible hors connexion. Ouvrez-le une fois avec internet pour le garder sur cet appareil.';
        throw error;
      }
      error.userMessage = describeError(error);
      throw error;
    }
  }, [id]);

  const handleDownload = async () => {
    try {
      const data = await loadPdf(() => {});
      const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ebook?.title || 'livre'}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.userMessage || 'Téléchargement impossible');
    }
  };

  return (
    <BookReader
      bookId={id}
      title={ebook?.title || ''}
      author={ebook?.author}
      loadPdf={loadPdf}
      onBack={() => navigate('/my-library')}
      onDownload={handleDownload}
    />
  );
};

export default EbookReader;

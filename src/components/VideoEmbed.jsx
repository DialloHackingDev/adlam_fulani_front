import { useState } from 'react';
import { HiPlay, HiX } from 'react-icons/hi';

const VideoEmbed = ({ url, title = 'Video' }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extraire l'ID de la vidéo YouTube
  const getYouTubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Extraire l'ID de la vidéo Vimeo
  const getVimeoId = (url) => {
    const regExp = /vimeo.*\/(\d+)/i;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  // Déterminer le type de vidéo
  const getVideoType = (url) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    }
    return null;
  };

  const videoType = getVideoType(url);
  const videoId = videoType === 'youtube' ? getYouTubeId(url) : getVimeoId(url);

  if (!videoId || !videoType) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <p className="text-red-600">URL vidéo invalide</p>
      </div>
    );
  }

  const embedUrl = videoType === 'youtube'
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
    : `https://player.vimeo.com/video/${videoId}?autoplay=1`;

  const thumbnailUrl = videoType === 'youtube'
    ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
    : `https://vumbnail.com/${videoId}.jpg`;

  return (
    <div className="relative w-full rounded-lg overflow-hidden bg-black" style={{ paddingBottom: '56.25%' }}>
      {!isPlaying ? (
        <>
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="bg-red-600 hover:bg-red-700 text-white rounded-full p-6 transition-all transform hover:scale-110"
            >
              <HiPlay className="h-12 w-12" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <p className="text-white font-medium">{title}</p>
          </div>
        </>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={embedUrl}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

// Composant pour ajouter une vidéo dans l'éditeur
export const VideoEmbedButton = ({ onInsert }) => {
  const [showModal, setShowModal] = useState(false);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');

  const handleInsert = () => {
    if (url) {
      const videoHtml = `<div class="video-embed" data-url="${url}" data-title="${title}"></div>`;
      onInsert(videoHtml);
      setUrl('');
      setTitle('');
      setShowModal(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
      >
        <HiPlay className="mr-2" />
        Insérer vidéo
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Insérer une vidéo</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <HiX className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  URL YouTube ou Vimeo
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Titre (optionnel)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Titre de la vidéo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  onClick={handleInsert}
                  disabled={!url}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Insérer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoEmbed;

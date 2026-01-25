import { useState, useRef, useEffect } from 'react';
import { HiOutlineEye, HiArrowsExpand, HiOutlineDocumentText, HiOutlineCode } from 'react-icons/hi';

const SimpleTextEditor = ({ value, onChange, placeholder = 'Commencez à écrire...', showPreview = false, onPreviewChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const togglePreview = () => {
    const newPreviewMode = !isPreviewMode;
    setIsPreviewMode(newPreviewMode);
    if (onPreviewChange) {
      onPreviewChange(newPreviewMode);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Fonction pour insérer du contenu formaté
  const insertFormatting = (before, after = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const formattedText = before + selectedText + after;
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Repositionner le curseur
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  const insertBold = () => insertFormatting('**', '**');
  const insertItalic = () => insertFormatting('*', '*');
  const insertHeading = () => insertFormatting('## ');
  const insertList = () => insertFormatting('- ');
  const insertLink = () => {
    const url = prompt('Entrez l\'URL:');
    if (url) {
      insertFormatting('[', `](${url})`);
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b px-4 py-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={insertBold}
            className="p-2 rounded hover:bg-gray-200 font-bold"
            title="Gras"
          >
            B
          </button>
          <button
            onClick={insertItalic}
            className="p-2 rounded hover:bg-gray-200 italic"
            title="Italique"
          >
            I
          </button>
          <button
            onClick={insertHeading}
            className="p-2 rounded hover:bg-gray-200"
            title="Titre"
          >
            H
          </button>
          <button
            onClick={insertList}
            className="p-2 rounded hover:bg-gray-200"
            title="Liste"
          >
            •
          </button>
          <button
            onClick={insertLink}
            className="p-2 rounded hover:bg-gray-200"
            title="Lien"
          >
            🔗
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {showPreview && (
            <button
              onClick={togglePreview}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title={isPreviewMode ? 'Mode édition' : 'Aperçu'}
            >
              <HiOutlineEye className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title={isFullscreen ? 'Quitter le plein écran' : 'Plein écran'}
          >
            <HiArrowsExpand className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Éditeur ou Aperçu */}
        <div className={`${showPreview && isPreviewMode ? 'w-1/2' : 'w-full'} ${isFullscreen ? 'h-screen' : ''}`}>
          {isPreviewMode ? (
            <div className="p-4 h-96 overflow-y-auto">
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: value
                    .replace(/### (.*)/g, '<h3>$1</h3>')
                    .replace(/## (.*)/g, '<h2>$1</h2>')
                    .replace(/# (.*)/g, '<h1>$1</h1>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^- (.*)/gm, '<li>$1</li>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                    .replace(/\n/g, '<br>')
                }}
              />
            </div>
          ) : (
            <textarea
              ref={textareaRef}
              value={value}
              onChange={handleChange}
              placeholder={placeholder}
              className={`w-full p-4 border-0 focus:outline-none focus:ring-0 resize-none font-mono text-sm ${isFullscreen ? 'h-screen' : 'h-96'}`}
              dir="rtl"
              style={{ minHeight: '300px' }}
            />
          )}
        </div>

        {/* Aperçu en mode split */}
        {showPreview && isPreviewMode && (
          <div className="w-1/2 border-l">
            <div className="p-4 h-96 overflow-y-auto bg-gray-50">
              <div className="text-sm text-gray-600 mb-2">Aperçu:</div>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: value
                    .replace(/### (.*)/g, '<h3>$1</h3>')
                    .replace(/## (.*)/g, '<h2>$1</h2>')
                    .replace(/# (.*)/g, '<h1>$1</h1>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/^- (.*)/gm, '<li>$1</li>')
                    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
                    .replace(/\n/g, '<br>')
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleTextEditor;

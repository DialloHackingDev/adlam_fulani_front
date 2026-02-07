import { useState, useRef, useEffect } from 'react';
import { HiOutlineEye, HiArrowsExpand, HiOutlineDocumentText, HiOutlineCode } from 'react-icons/hi';

const SimpleTextEditor = ({ value, onChange, placeholder = '𞤆𞤵𞤤𞤢𞤲𞤣𞤫 𞤸𞤢𞤲𞤣𞤢𞤤...', showPreview = false, onPreviewChange }) => {
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
    const url = prompt('𞤖𞤢𞤤𞤢𞤲𞤣𞤫 URL:');
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
            title="𞤅𞤫𞤥𞤦𞤫"
          >
            B
          </button>
          <button
            onClick={insertItalic}
            className="p-2 rounded hover:bg-gray-200 italic"
            title="𞤋𞤼𞤢𞤤𞤭𞤳"
          >
            I
          </button>
          <button
            onClick={insertHeading}
            className="p-2 rounded hover:bg-gray-200"
            title="𞤚𞤢𞤦𞤭"
          >
            H
          </button>
          <button
            onClick={insertList}
            className="p-2 rounded hover:bg-gray-200"
            title="𞤂𞤭𞤧𞤼"
          >
            •
          </button>
          <button
            onClick={insertLink}
            className="p-2 rounded hover:bg-gray-200"
            title="𞤂𞤭𞤲𞤳"
          >
            🔗
          </button>
        </div>
        
        <div className="flex items-center space-x-2">
          {showPreview && (
            <button
              onClick={togglePreview}
              className="p-2 rounded hover:bg-gray-200 transition-colors"
              title={isPreviewMode ? '𞤃𞤮𞤣 𞤆𞤢𞤴𞤭' : '𞤐𞤢𞤴𞤢𞤤'}
            >
              <HiOutlineEye className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded hover:bg-gray-100 transition-colors"
            title={isFullscreen ? '𞤊𞤵𞤳𞤢 𞤬𞤵𞤤𞤢𞤲 𞤫𞤳𞤪𞤢𞤲' : '𞤊𞤵𞤤𞤢𞤲 𞤫𞤳𞤪𞤢𞤲'}
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
              <div className="text-sm text-gray-600 mb-2">𞤐𞤢𞤴𞤢𞤤:</div>
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

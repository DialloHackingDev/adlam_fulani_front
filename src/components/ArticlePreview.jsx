import { useState, useEffect } from 'react';
import { HiEye, HiCode } from 'react-icons/hi';

const ArticlePreview = ({ title, content, excerpt, category, tags, coverImage }) => {
  const [previewMode, setPreviewMode] = useState('desktop');
  const [showHTML, setShowHTML] = useState(false);

  const categoryMap = {
    'litterature': '𞤀𞤣𞤢𞤦𞤢𞤲',
    'histoire': '𞤚𞤢𞤪𞤭𞤲𞤢𞤤',
    'education': '𞤔𞤢𞤲𞤺𞤢𞤤',
    'culture': '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤',
    'science': '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭',
    'religion': '𞤄𞤭𞤲𞤢𞤤'
  };

  const calculateReadingTime = (text) => {
    const wordsPerMinute = 150;
    const cleanText = text.replace(/<[^>]*>/g, '');
    const words = cleanText.length / 6;
    return Math.ceil(words / wordsPerMinute);
  };

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'max-w-4xl';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Preview Controls */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setPreviewMode('mobile')}
            className={`px-3 py-1 rounded ${previewMode === 'mobile' ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            📱 Mobile
          </button>
          <button
            onClick={() => setPreviewMode('tablet')}
            className={`px-3 py-1 rounded ${previewMode === 'tablet' ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            📱 Tablet
          </button>
          <button
            onClick={() => setPreviewMode('desktop')}
            className={`px-3 py-1 rounded ${previewMode === 'desktop' ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            💻 Desktop
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowHTML(!showHTML)}
            className={`px-3 py-1 rounded flex items-center ${showHTML ? 'bg-black text-white' : 'bg-gray-100'}`}
          >
            <HiCode className="mr-1" />
            {showHTML ? 'Aperçu' : 'HTML'}
          </button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className={`mx-auto bg-white rounded-lg shadow-lg ${getPreviewWidth()} transition-all duration-300`}>
          {showHTML ? (
            <div className="p-6">
              <pre className="text-xs bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-96">
                {content}
              </pre>
            </div>
          ) : (
            <>
              {/* Cover Image */}
              {coverImage && (
                <div className="relative h-64 overflow-hidden rounded-t-lg">
                  <img
                    src={typeof coverImage === 'string' ? coverImage : URL.createObjectURL(coverImage)}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              )}

              <div className="p-6">
                {/* Category Badge */}
                {category && (
                  <div className="mb-4">
                    <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {categoryMap[category] || category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {title || 'عنوان المقال'}
                </h1>

                {/* Meta Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-6">
                  <div className="flex items-center">
                    <HiEye className="ml-1" />
                    {calculateReadingTime(content || '')} دقائق
                  </div>
                  <div>
                    {new Date().toLocaleDateString('ar')}
                  </div>
                </div>

                {/* Excerpt */}
                {excerpt && (
                  <div className="bg-blue-50 border-r-4 border-blue-600 p-4 mb-6 rounded">
                    <p className="text-gray-700 italic">
                      {excerpt}
                    </p>
                  </div>
                )}

                {/* Content */}
                <div
                  className="prose prose-lg max-w-none"
                  style={{
                    fontFamily: 'Noto Sans Adlam, Georgia, serif',
                    textAlign: 'right',
                    direction: 'rtl'
                  }}
                  dangerouslySetInnerHTML={{ __html: content || '<p>المحتوى سيظهر هنا...</p>' }}
                />

                {/* Tags */}
                {tags && tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticlePreview;

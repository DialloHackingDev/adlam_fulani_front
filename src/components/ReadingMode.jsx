import { useState } from 'react';
import { HiX, HiAdjustments } from 'react-icons/hi';

const ReadingMode = ({ content, title, onClose }) => {
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState('light');
  const [fontFamily, setFontFamily] = useState('serif');

  const themes = {
    light: { bg: 'bg-white', text: 'text-gray-900' },
    dark: { bg: 'bg-gray-900', text: 'text-gray-100' },
    sepia: { bg: 'bg-amber-50', text: 'text-amber-900' }
  };

  const fonts = {
    serif: 'font-serif',
    sans: 'font-sans',
    adlam: 'font-adlam'
  };

  return (
    <div className={`fixed inset-0 z-50 ${themes[theme].bg} ${themes[theme].text} overflow-auto`}>
      {/* Header Controls */}
      <div className="sticky top-0 bg-opacity-95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-10" style={{ backgroundColor: themes[theme].bg.replace('bg-', '') }}>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <HiX className="h-6 w-6" />
          </button>

          <div className="flex items-center space-x-4">
            {/* Font Size */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                A-
              </button>
              <span className="text-sm">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(28, fontSize + 2))}
                className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                A+
              </button>
            </div>

            {/* Theme */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTheme('light')}
                className={`w-8 h-8 rounded-full bg-white border-2 ${theme === 'light' ? 'border-blue-500' : 'border-gray-300'}`}
              />
              <button
                onClick={() => setTheme('sepia')}
                className={`w-8 h-8 rounded-full bg-amber-50 border-2 ${theme === 'sepia' ? 'border-blue-500' : 'border-gray-300'}`}
              />
              <button
                onClick={() => setTheme('dark')}
                className={`w-8 h-8 rounded-full bg-gray-900 border-2 ${theme === 'dark' ? 'border-blue-500' : 'border-gray-300'}`}
              />
            </div>

            {/* Font Family */}
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 border-none"
            >
              <option value="serif">Serif</option>
              <option value="sans">Sans-serif</option>
              <option value="adlam">Adlam</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 
          className={`text-4xl font-bold mb-8 ${fonts[fontFamily]}`}
          style={{ fontSize: `${fontSize + 12}px` }}
          dir="rtl"
        >
          {title}
        </h1>

        <div
          className={`prose prose-lg max-w-none ${fonts[fontFamily]}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: '1.8',
            textAlign: 'right',
            direction: 'rtl'
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </div>
  );
};

export default ReadingMode;

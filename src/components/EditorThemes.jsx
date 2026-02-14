import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditorThemes = ({ value, onChange }) => {
  const [theme, setTheme] = useState('light');
  const [fontSize, setFontSize] = useState(16);

  const themes = {
    light: {
      bg: '#ffffff',
      text: '#000000',
      border: '#e5e7eb'
    },
    dark: {
      bg: '#1f2937',
      text: '#f9fafb',
      border: '#374151'
    },
    sepia: {
      bg: '#f5f5dc',
      text: '#5c4033',
      border: '#d4c5a9'
    },
    contrast: {
      bg: '#000000',
      text: '#ffff00',
      border: '#ffff00'
    }
  };

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': ['Noto Sans Adlam', 'Noto Serif Adlam', 'Kigelia Adlam', 'sans-serif', 'serif'] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'indent',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  return (
    <div className="space-y-4">
      {/* Theme Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium">Thème:</span>
          <div className="flex space-x-2">
            <button
              onClick={() => setTheme('light')}
              className={`px-3 py-1 rounded ${theme === 'light' ? 'bg-white text-black border-2 border-black' : 'bg-gray-200'}`}
            >
              ☀️ Clair
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`px-3 py-1 rounded ${theme === 'dark' ? 'bg-gray-900 text-white border-2 border-white' : 'bg-gray-200'}`}
            >
              🌙 Sombre
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-3 py-1 rounded ${theme === 'sepia' ? 'bg-amber-100 text-amber-900 border-2 border-amber-900' : 'bg-gray-200'}`}
            >
              📜 Sépia
            </button>
            <button
              onClick={() => setTheme('contrast')}
              className={`px-3 py-1 rounded ${theme === 'contrast' ? 'bg-black text-yellow-400 border-2 border-yellow-400' : 'bg-gray-200'}`}
            >
              ⚡ Contraste
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Taille:</span>
          <button
            onClick={() => setFontSize(Math.max(12, fontSize - 2))}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            A-
          </button>
          <span className="text-sm">{fontSize}px</span>
          <button
            onClick={() => setFontSize(Math.min(24, fontSize + 2))}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            A+
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        style={{
          backgroundColor: themes[theme].bg,
          color: themes[theme].text,
          borderColor: themes[theme].border,
          fontSize: `${fontSize}px`
        }}
        className="rounded-lg border-2 overflow-hidden"
      >
        <style>
          {`
            .ql-container {
              background-color: ${themes[theme].bg};
              color: ${themes[theme].text};
              font-size: ${fontSize}px;
            }
            .ql-editor {
              min-height: 400px;
              background-color: ${themes[theme].bg};
              color: ${themes[theme].text};
            }
            .ql-toolbar {
              background-color: ${themes[theme].bg};
              border-color: ${themes[theme].border} !important;
            }
            .ql-stroke {
              stroke: ${themes[theme].text} !important;
            }
            .ql-fill {
              fill: ${themes[theme].text} !important;
            }
            .ql-picker-label {
              color: ${themes[theme].text} !important;
            }
          `}
        </style>
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Écrivez votre contenu ici..."
        />
      </div>
    </div>
  );
};

export default EditorThemes;

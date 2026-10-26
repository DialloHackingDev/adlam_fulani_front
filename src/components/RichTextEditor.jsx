import { useState, useRef, useEffect } from 'react';

// Mapping des caractères français vers Fulani/Adlam
const frenchToAdlam = {
  'a': '𞤢', 'b': '𞤦', 'c': '𞤷', 'd': '𞤣', 'e': '𞤫', 'f': '𞤬', 'g': '𞤺', 'h': '𞤸', 'i': '𞤭', 'j': '𞤶', 'k': '𞤳', 'l': '𞤤', 'm': '𞤥', 'n': '𞤲', 'o': '𞤮', 'p': '𞤨', 'q': '𞤹', 'r': '𞤪', 's': '𞤧', 't': '𞤼', 'u': '𞤵', 'v': '𞤾', 'w': '𞤱', 'x': '𞤿', 'y': '𞤴', 'z': '𞤶',
  'A': '𞤀', 'B': '𞤄', 'C': '𞤕', 'D': '𞤁', 'E': '𞤉', 'F': '𞤊', 'G': '𞤘', 'H': '𞤖', 'I': '𞤋', 'J': '𞤔', 'K': '𞤑', 'L': '𞤂', 'M': '𞤃', 'N': '𞤐', 'O': '𞤌', 'P': '𞤆', 'Q': '𞤗', 'R': '𞤈', 'S': '𞤅', 'T': '𞤚', 'U': '𞤓', 'V': '𞤜', 'W': '𞤏', 'X': '𞤝', 'Y': '𞤒', 'Z': '𞤔'
};

const RichTextEditor = ({ value, onChange, placeholder = "𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤲𞤣𞤫...", className = "" }) => {
  const editorRef = useRef(null);
  // Dernier contenu envoyé au parent : permet de distinguer nos propres frappes
  // d'un changement venu de l'extérieur (chargement d'un article à modifier)
  const lastEmittedRef = useRef(null);
  const [selectedFont, setSelectedFont] = useState('Noto Sans Adlam');
  const [fontSize, setFontSize] = useState('16');

  const fonts = [
    { name: 'Noto Sans Adlam', value: 'Noto Sans Adlam, sans-serif' },
    { name: 'Noto Serif Adlam', value: 'Noto Serif Adlam, serif' },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' }
  ];

  const fontSizes = ['12', '14', '16', '18', '20', '24', '28', '32'];

  // Réécrire le contenu uniquement s'il change de l'extérieur : le faire pendant la
  // saisie remettait le curseur au début du texte
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || value === lastEmittedRef.current) return;
    if (editor.innerHTML !== (value || '')) {
      editor.innerHTML = value || '';
    }
    lastEmittedRef.current = value;
  }, [value]);

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  const insertTextAtCursor = (text) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      
      const textNode = document.createTextNode(text);
      range.insertNode(textNode);
      
      // Positionner le curseur après le texte inséré
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const handleContentChange = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    if (html === lastEmittedRef.current) return;
    lastEmittedRef.current = html;
    onChange(html);
  };

  // Les boutons de la barre ne doivent ni soumettre le formulaire ni voler la sélection
  const keepSelection = (e) => e.preventDefault();

  const handleKeyPress = (e) => {
    const char = e.key;
    if (frenchToAdlam[char]) {
      e.preventDefault();
      insertTextAtCursor(frenchToAdlam[char]);
      handleContentChange();
    }
  };

  const handleFontChange = (fontFamily) => {
    setSelectedFont(fontFamily);
    executeCommand('fontName', fontFamily);
  };

  const handleFontSizeChange = (size) => {
    setFontSize(size);
    executeCommand('fontSize', '7');
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = size + 'px';
      try {
        range.surroundContents(span);
      } catch (e) {
        span.appendChild(range.extractContents());
        range.insertNode(span);
      }
    }
    handleContentChange();
  };

  return (
    <div className={`border border-gray-300 rounded-xl overflow-hidden bg-white ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Font Family */}
          <select
            value={selectedFont}
            onChange={(e) => handleFontChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            {fonts.map((font) => (
              <option key={font.name} value={font.value}>
                {font.name}
              </option>
            ))}
          </select>

          {/* Font Size */}
          <select
            value={fontSize}
            onChange={(e) => handleFontSizeChange(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            {fontSizes.map((size) => (
              <option key={size} value={size}>
                {size}px
              </option>
            ))}
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Format Buttons */}
          <button
            type="button"
            onMouseDown={keepSelection}
            onClick={() => executeCommand('bold')}
            className="px-3 py-1.5 text-sm font-bold border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="𞤄𞤮𞤤𞤣"
          >
            B
          </button>
          
          <button
            type="button"
            onMouseDown={keepSelection}
            onClick={() => executeCommand('italic')}
            className="px-3 py-1.5 text-sm italic border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="𞤋𞤼𞤢𞤤𞤭𞤳"
          >
            I
          </button>
          
          <button
            type="button"
            onMouseDown={keepSelection}
            onClick={() => executeCommand('underline')}
            className="px-3 py-1.5 text-sm underline border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="𞤒𞤲𞤣𞤫𞤪𞤤𞤢𞤴𞤲"
          >
            U
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          <button
            type="button"
            onMouseDown={keepSelection}
            onClick={() => executeCommand('insertUnorderedList')}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="𞤂𞤭𞤧𞤼 𞤄𞤵𞤤𞤫𞤼"
          >
            •
          </button>
          
          <button
            type="button"
            onMouseDown={keepSelection}
            onClick={() => executeCommand('insertOrderedList')}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors"
            title="𞤂𞤭𞤧𞤼 𞤐𞤵𞤥𞤦𞤫𞤪"
          >
            1.
          </button>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onKeyPress={handleKeyPress}
        onBlur={handleContentChange}
        className="min-h-[300px] p-4 focus:outline-none text-right"
        style={{ 
          fontFamily: selectedFont,
          fontSize: fontSize + 'px',
          direction: 'rtl',
          unicodeBidi: 'plaintext'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
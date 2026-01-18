import { useState, useRef } from 'react';

// Mapping des caractères français vers Fulani/Adlam
const frenchToAdlam = {
  'a': '𞤢', 'b': '𞤦', 'c': '𞤷', 'd': '𞤣', 'e': '𞤫', 'f': '𞤬', 'g': '𞤺', 'h': '𞤸', 'i': '𞤭', 'j': '𞤶', 'k': '𞤳', 'l': '𞤤', 'm': '𞤥', 'n': '𞤲', 'o': '𞤮', 'p': '𞤨', 'q': '𞤹', 'r': '𞤪', 's': '𞤧', 't': '𞤼', 'u': '𞤵', 'v': '𞤾', 'w': '𞤱', 'x': '𞤿', 'y': '𞤴', 'z': '𞤶',
  'A': '𞤀', 'B': '𞤄', 'C': '𞤕', 'D': '𞤁', 'E': '𞤉', 'F': '𞤊', 'G': '𞤘', 'H': '𞤖', 'I': '𞤋', 'J': '𞤔', 'K': '𞤑', 'L': '𞤂', 'M': '𞤃', 'N': '𞤐', 'O': '𞤌', 'P': '𞤆', 'Q': '𞤗', 'R': '𞤈', 'S': '𞤅', 'T': '𞤚', 'U': '𞤓', 'V': '𞤜', 'W': '𞤏', 'X': '𞤝', 'Y': '𞤒', 'Z': '𞤔'
};

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  const executeCommand = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
  };

  const handleBold = () => executeCommand('bold');
  const handleItalic = () => executeCommand('italic');
  const handleUnderline = () => executeCommand('underline');
  const handleFontSize = (size) => executeCommand('fontSize', size);
  const handleFontFamily = (font) => executeCommand('fontName', font);

  const handleContentChange = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleKeyPress = (e) => {
    const char = e.key;
    if (frenchToAdlam[char]) {
      e.preventDefault();
      document.execCommand('insertText', false, frenchToAdlam[char]);
    }
  };

  return (
    <div className="rich-text-editor border border-gray-300 rounded-lg" dir="rtl">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 flex flex-wrap gap-2 bg-gray-50">
        {/* Font Family */}
        <select 
          className="px-3 py-1 border border-gray-300 rounded text-sm"
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => handleFontFamily(e.target.value)}
          defaultValue="Noto Sans Adlam"
        >
          <option value="Noto Sans Adlam">𞤐𞤮𞤼𞤮 𞤅𞤢𞤲𞤧 𞤀𞤣𞤤𞤢𞤥</option>
          <option value="Noto Serif Adlam">𞤐𞤮𞤼𞤮 𞤅𞤫𞤪𞤭𞤬 𞤀𞤣𞤤𞤢𞤥</option>
          <option value="Arial">𞤀𞤪𞤭𞤢𞤤</option>
        </select>

        {/* Font Size */}
        <select 
          className="px-3 py-1 border border-gray-300 rounded text-sm"
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => handleFontSize(e.target.value)}
          defaultValue="3"
        >
          <option value="1">𞤑𞤫𞤯𞤭𞤲𞤢𞤲</option>
          <option value="2">𞤊𞤫𞤯𞤭𞤲𞤢𞤲</option>
          <option value="3">𞤐𞤢𞤲𞤺𞤢𞤤</option>
          <option value="4">𞤃𞤢𞤱𞤲𞤢𞤲</option>
          <option value="5">𞤃𞤢𞤱𞤲𞤢𞤲 𞤀𞤪𞤣𞤭𞤲</option>
        </select>

        {/* Formatting Buttons */}
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleBold}
          className="px-3 py-1 hover:bg-gray-200 rounded font-bold border border-gray-300"
          title="𞤄𞤮𞤤𞤣"
        >
          𞤄
        </button>
        
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleItalic}
          className="px-3 py-1 hover:bg-gray-200 rounded italic border border-gray-300"
          title="𞤋𞤼𞤢𞤤𞤭𞤳"
        >
          𞤋
        </button>
        
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={handleUnderline}
          className="px-3 py-1 hover:bg-gray-200 rounded underline border border-gray-300"
          title="𞤚𞤫𞤸𞤼𞤫"
        >
          𞤚
        </button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-96 focus:outline-none"
        style={{
          direction: 'rtl',
          textAlign: 'right',
          fontFamily: 'Noto Sans Adlam, sans-serif',
          lineHeight: '1.6'
        }}
        onInput={handleContentChange}
        onKeyPress={handleKeyPress}
        dangerouslySetInnerHTML={{ __html: value || '' }}
        data-placeholder={placeholder}
      />
      
      {/* Placeholder styling */}
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
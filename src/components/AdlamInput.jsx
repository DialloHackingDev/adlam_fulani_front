import { useState, useRef } from 'react';

// Mapping des caractères français vers Fulani/Adlam
const frenchToAdlam = {
  'a': '𞤢', 'b': '𞤦', 'c': '𞤷', 'd': '𞤣', 'e': '𞤫', 'f': '𞤬', 'g': '𞤺', 'h': '𞤸', 'i': '𞤭', 'j': '𞤶', 'k': '𞤳', 'l': '𞤤', 'm': '𞤥', 'n': '𞤲', 'o': '𞤮', 'p': '𞤨', 'q': '𞤹', 'r': '𞤪', 's': '𞤧', 't': '𞤼', 'u': '𞤵', 'v': '𞤾', 'w': '𞤱', 'x': '𞤿', 'y': '𞤴', 'z': '𞤶',
  'A': '𞤀', 'B': '𞤄', 'C': '𞤕', 'D': '𞤁', 'E': '𞤉', 'F': '𞤊', 'G': '𞤘', 'H': '𞤖', 'I': '𞤋', 'J': '𞤔', 'K': '𞤑', 'L': '𞤂', 'M': '𞤃', 'N': '𞤐', 'O': '𞤌', 'P': '𞤆', 'Q': '𞤗', 'R': '𞤈', 'S': '𞤅', 'T': '𞤚', 'U': '𞤓', 'V': '𞤜', 'W': '𞤏', 'X': '𞤝', 'Y': '𞤒', 'Z': '𞤔'
};

const AdlamInput = ({ value, onChange, type = "text", className = "", ...props }) => {
  const inputRef = useRef(null);

  const handleKeyPress = (e) => {
    const char = e.key;
    if (frenchToAdlam[char]) {
      e.preventDefault();
      
      const input = inputRef.current;
      const start = input.selectionStart;
      const end = input.selectionEnd;
      
      // Utiliser la même approche que le RichTextEditor qui fonctionne
      const beforeText = value.substring(0, start);
      const afterText = value.substring(end);
      const newValue = beforeText + frenchToAdlam[char] + afterText;
      
      // Mettre à jour directement la valeur
      onChange({ target: { value: newValue, name: props.name } });
      
      // Repositionner le curseur
      setTimeout(() => {
        const newPosition = start + frenchToAdlam[char].length;
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  return (
    <input
      ref={inputRef}
      type={type}
      value={value}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      className={`text-right ${className}`}
      dir="rtl"
      style={{
        fontFamily: 'Noto Sans Adlam, sans-serif',
        lineHeight: '1.6',
        unicodeBidi: 'plaintext'
      }}
      {...props}
    />
  );
};

const AdlamTextarea = ({ value, onChange, className = "", ...props }) => {
  const textareaRef = useRef(null);

  const handleKeyPress = (e) => {
    const char = e.key;
    if (frenchToAdlam[char]) {
      e.preventDefault();
      
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Utiliser la même approche que le RichTextEditor qui fonctionne
      const beforeText = value.substring(0, start);
      const afterText = value.substring(end);
      const newValue = beforeText + frenchToAdlam[char] + afterText;
      
      // Mettre à jour directement la valeur
      onChange({ target: { value: newValue, name: props.name } });
      
      // Repositionner le curseur
      setTimeout(() => {
        const newPosition = start + frenchToAdlam[char].length;
        textarea.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      className={`text-right ${className}`}
      dir="rtl"
      style={{
        fontFamily: 'Noto Sans Adlam, sans-serif',
        lineHeight: '1.6',
        unicodeBidi: 'plaintext'
      }}
      {...props}
    />
  );
};

export { AdlamInput, AdlamTextarea };
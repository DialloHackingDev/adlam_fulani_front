import React, { useState, useEffect } from 'react';
import { HiOutlineBookOpen } from 'react-icons/hi';

const TableOfContents = ({ content, mobile = false }) => {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    if (!content) return;

    // Parser le contenu HTML pour extraire les headings
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const headingElements = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const extractedHeadings = Array.from(headingElements).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent,
      level: parseInt(heading.tagName.charAt(1)),
      element: heading
    }));

    setHeadings(extractedHeadings);
  }, [content]);

  const scrollToHeading = (headingId) => {
    const element = document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const getHeadingClass = (level) => {
    const baseClasses = "block py-2 px-3 hover:bg-gray-100 rounded transition-colors";
    const indentClasses = {
      1: '',
      2: 'pr-4',
      3: 'pr-8',
      4: 'pr-12',
      5: 'pr-16',
      6: 'pr-20'
    };
    const sizeClasses = {
      1: 'text-sm font-bold',
      2: 'text-sm font-semibold',
      3: 'text-sm',
      4: 'text-xs',
      5: 'text-xs',
      6: 'text-xs'
    };
    
    return `${baseClasses} ${indentClasses[level]} ${sizeClasses[level]}`;
  };

  if (headings.length === 0) {
    return (
      <div className={`${mobile ? 'p-4' : 'sticky top-4'} bg-white rounded-lg border border-gray-200 p-4`}>
        <div className="flex items-center text-gray-500 text-sm">
          <HiOutlineBookOpen className="ml-2 h-4 w-4" />
          𞤢𞤬𞤭𞤲 𞤸𞤢𞤥𞤵𞤤𞤫 𞤥𞤢𞤲𞤭𞤲𞤢𞥄𞤲
        </div>
      </div>
    );
  }

  return (
    <div className={`${mobile ? 'p-4' : 'sticky top-4'} bg-white rounded-lg border border-gray-200 p-4`}>
      <h3 className="font-bold text-black mb-4 flex items-center" dir="rtl">
        <HiOutlineBookOpen className="ml-2 h-5 w-5" />
        𞤚𞤢𞤥𞤵𞤤𞤫 𞤥𞤢𞤲𞤭𞤲𞤢𞥄𞤲
      </h3>
      <nav className="space-y-1" dir="rtl">
        {headings.map((heading) => (
          <button
            key={heading.id}
            onClick={() => scrollToHeading(heading.id)}
            className={getHeadingClass(heading.level)}
            style={{ textAlign: 'right' }}
          >
            {heading.text}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TableOfContents;

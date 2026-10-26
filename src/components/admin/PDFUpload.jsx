import { useState, useRef } from 'react';
import { HiUpload, HiX, HiDocumentText } from 'react-icons/hi';

const PDFUpload = ({ onPDFSelect, currentPDF, label }) => {
  const [selectedFile, setSelectedFile] = useState(currentPDF || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      onPDFSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = () => {
    setSelectedFile(null);
    onPDFSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      {selectedFile ? (
        <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50">
          <div className="flex items-center space-x-3">
            <HiDocumentText className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedFile.name || '𞤊𞤢𞤦𞤢𞤤 PDF'}
              </p>
              <p className="text-xs text-gray-500">
                {selectedFile.size ? formatFileSize(selectedFile.size) : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-red-600 hover:text-red-800 transition-colors"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <HiDocumentText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-black hover:underline">
              𞤑𞤢𞤦𞤢𞤤 𞤊𞤢𞤦𞤢𞤤 PDF
            </span>
            {' '}𞤫𞤤𞤤𞤢 𞤣𞤢𞤺 𞤊𞤢𞤦𞤢𞤤 𞤲𞤣𞤫𞤪
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PDF 𞤸𞤢𞤤 50MB
          </p>
        </div>
      )}
      
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default PDFUpload;
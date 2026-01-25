import { useState, useRef } from 'react';
import { HiUpload, HiX, HiPhotograph } from 'react-icons/hi';

const ImageUpload = ({ onImageSelect, currentImage, label }) => {
  const [preview, setPreview] = useState(currentImage || null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  const validateFile = (file) => {
    // Vérifier le format
    if (!ALLOWED_FORMATS.includes(file.type)) {
      setError('𞤊𞤮𞤪𞤥𞤢𞤼 𞤸𞤮𞤪𞤮 𞤲𞤣𞤫 𞤧𞤢𞤦𞤢𞤲𞤢𞤲. 𞤑𞤢𞤦𞤢𞤤 JPG, PNG 𞤫𞤤𞤤𞤢 WEBP');
      return false;
    }

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      setError('𞤸𞤮𞤪𞤮 𞤲𞤣𞤫 𞤥𞤢𞤱𞤲𞤢𞤲 𞤸𞤢𞤤. 𞤃𞤢𞤳𞤧𞤭𞤥𞤵𞤥: 5MB');
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (file) => {
    if (file && validateFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
        onImageSelect(file);
      };
      reader.readAsDataURL(file);
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

  const removeImage = () => {
    setPreview(null);
    setError(null);
    onImageSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2" dir="rtl">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>

      {/* Message d'erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
          >
            <HiX className="h-4 w-4" />
          </button>
          {/* Informations sur l'image */}
          <div className="mt-2 text-xs text-gray-500 text-right">
            ✓ 𞤸𞤮𞤪𞤮 𞤳𞤢𞤦𞤢𞤤𞤢𞤲𞤢𞤲
          </div>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver
              ? 'border-black bg-gray-50'
              : 'border-gray-300 hover:border-gray-400'
            }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <HiPhotograph className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-black hover:underline">
              𞤑𞤢𞤦𞤢𞤤 𞤸𞤮𞤪𞤮
            </span>
            {' '}𞤫𞤤𞤤𞤢 𞤣𞤢𞤺 𞤸𞤮𞤪𞤮 𞤲𞤣𞤫𞤪
          </div>
          <p className="text-xs text-gray-500 mt-2">
            PNG, JPG, WEBP • 𞤃𞤢𞤳𞤧 5MB
          </p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={(e) => handleFileSelect(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;
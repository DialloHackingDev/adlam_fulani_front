import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft, HiSave, HiEye, HiUpload } from 'react-icons/hi';
import RichTextEditor from '../components/RichTextEditor';
import { AdlamInput, AdlamTextarea } from '../components/AdlamInput';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/apiService';

const ArticleEditor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'litterature',
    tags: [],
    status: 'draft',
    featured: false,
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    coverImage: null
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    { value: 'litterature', label: '𞤀𞤣𞤢𞤦𞤢𞤲' },
    { value: 'histoire', label: '𞤚𞤢𞤪𞤭𞤲𞤢𞤤' },
    { value: 'education', label: '𞤔𞤢𞤲𞤺𞤢𞤤' },
    { value: 'culture', label: '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤' },
    { value: 'science', label: '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭' },
    { value: 'religion', label: '𞤄𞤭𞤲𞤢𞤤' }
  ];

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    if (isEditing) {
      fetchArticle();
    }
  }, [user, navigate, id, isEditing]);

  const fetchArticle = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiService.articles.getById(id);
      const article = response.data.data.article;
      
      setFormData({
        title: article.title || '',
        content: article.content || '',
        excerpt: article.excerpt || '',
        category: article.category || 'litterature',
        tags: article.tags || [],
        status: article.status || 'draft',
        featured: article.featured || false,
        metaTitle: article.metaTitle || '',
        metaDescription: article.metaDescription || '',
        keywords: article.keywords || [],
        coverImage: null
      });

      if (article.coverImage) {
        setImagePreview(article.coverImage);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleContentChange = useCallback((content) => {
    setFormData(prev => ({ ...prev, content }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, coverImage: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, []);

  const addTag = useCallback(() => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  }, [tagInput, formData.tags]);

  const removeTag = useCallback((tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  }, []);

  const addKeyword = useCallback(() => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }));
      setKeywordInput('');
    }
  }, [keywordInput, formData.keywords]);

  const removeKeyword = useCallback((keywordToRemove) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }));
  }, []);

  const handleSave = useCallback(async (status = formData.status) => {
    try {
      // Validation
      if (!formData.title.trim()) {
        alert('𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤚𞤢𞤦𞤭 𞤃𞤢𞤦𞤢𞤤');
        return;
      }
      if (!formData.content.trim()) {
        alert('𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤑𞤮𞤲𞤼𞤫𞤲𞤼 𞤃𞤢𞤦𞤢𞤤');
        return;
      }
      
      setSaving(true);
      
      const submitData = new FormData();
      
      // Champs simples
      submitData.append('title', formData.title.trim());
      submitData.append('content', formData.content.trim());
      submitData.append('excerpt', formData.excerpt.trim());
      submitData.append('category', formData.category);
      submitData.append('status', status);
      submitData.append('featured', formData.featured);
      submitData.append('metaTitle', formData.metaTitle.trim());
      submitData.append('metaDescription', formData.metaDescription.trim());
      
      // Image
      if (formData.coverImage) {
        submitData.append('coverImage', formData.coverImage);
      }
      
      // Tags et keywords en string séparés par virgules
      if (formData.tags.length > 0) {
        submitData.append('tags', formData.tags.join(','));
      }
      if (formData.keywords.length > 0) {
        submitData.append('keywords', formData.keywords.join(','));
      }

      let response;
      if (isEditing) {
        response = await apiService.articles.update(id, submitData);
      } else {
        response = await apiService.articles.create(submitData);
      }

      if (response.data.status === 'success') {
        navigate('/admin');
      }
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      alert(error.response?.data?.message || '𞤑𞤢𞤤𞤢 𞤲𞤢𞤲 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤅𞤢𞤦𞤢𞤲𞤣𞤫 𞤃𞤢𞤦𞤢𞤤');
    } finally {
      setSaving(false);
    }
  }, [formData, isEditing, id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center space-x-3 sm:space-x-4 space-x-reverse">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
            >
              <HiArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900" dir="rtl">
              {isEditing ? '𞤃𞤢𞤦𞤢𞤤 𞤆𞤢𞤴𞤭' : '𞤃𞤢𞤦𞤢𞤤 𞤚𞤢𞤥𞤭'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-3 space-x-reverse">
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <HiSave className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{saving ? '𞤔𞤢𞤪𞤭...' : '𞤅𞤢𞤦'}</span>
              <span className="sm:hidden">{saving ? '...' : '𞤅𞤢𞤦'}</span>
            </button>
            
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="flex items-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <HiEye className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{saving ? '𞤔𞤢𞤪𞤭...' : '𞤆𞤢𞤦𞤤𞤭𞤧'}</span>
              <span className="sm:hidden">{saving ? '...' : '𞤆𞤢𞤦'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3" dir="rtl">
                𞤚𞤢𞤦𞤭 𞤃𞤢𞤦𞤢𞤤
              </label>
              <AdlamInput
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤚𞤢𞤦𞤭 𞤃𞤢𞤦𞤢𞤤..."
              />
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3" dir="rtl">
                𞤃𞤢𞤦𞤢𞤤 𞤑𞤮𞤲𞤼𞤫𞤲𞤼
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={handleContentChange}
                placeholder="𞤖𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤦𞤢𞤤 𞤑𞤮𞤲𞤼𞤫𞤲𞤼..."
                className="min-h-[400px]"
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3" dir="rtl">
                𞤃𞤵𞤸𞤼𞤢𞤧𞤢𞤪
              </label>
              <AdlamTextarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="𞤃𞤵𞤸𞤼𞤢𞤧𞤢𞤪 𞤃𞤢𞤦𞤢𞤤..."
              />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
                𞤅𞤫𞤼𞤭𞤲𞤺 𞤃𞤢𞤦𞤢𞤤
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    𞤅𞤼𞤢𞤼𞤵𞤧
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">𞤃𞤪𞤢𞤬𞤼</option>
                    <option value="published">𞤆𞤢𞤦𞤤𞤭𞤧</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    𞤑𞤢𞤼𞤫𞤺𞤮𞤪𞤭
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="mr-2 text-sm text-gray-700" dir="rtl">
                    𞤃𞤢𞤦𞤢𞤤 𞤊𞤫𞤤𞤢𞤲
                  </label>
                </div>
              </div>
            </div>

            {/* Cover Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
                𞤐𞤢𞤼𞤢𞤤 𞤑𞤢𞤾𞤢
              </h3>
              
              <div className="space-y-4">
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="𞤐𞤢𞤼𞤢𞤤"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <HiUpload className="w-8 h-8 mb-4 text-gray-500" />
                    <p className="mb-2 text-sm text-gray-500" dir="rtl">
                      <span className="font-semibold">𞤑𞤤𞤭𞤳 𞤫 𞤢𞤨𞤤𞤮𞤣</span>
                    </p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
                𞤚𞤢𞤺𞤫
              </h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2 space-x-reverse">
                  <AdlamInput
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="𞤚𞤢𞤺 𞤚𞤢𞤥𞤭..."
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    +
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
                𞤅𞤫𞤼𞤭𞤲𞤺 𞤅𞤉𞤌 (SEO)
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    𞤚𞤢𞤦𞤭 𞤃𞤫𞤼𞤢
                  </label>
                  <AdlamInput
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="𞤚𞤢𞤦𞤭 𞤃𞤫𞤼𞤢 𞤅𞤉𞤌..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    𞤃𞤫𞤼𞤢 𞤃𞤵𞤸𞤼𞤢𞤧𞤢𞤪
                  </label>
                  <AdlamTextarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="𞤃𞤵𞤸𞤼𞤢𞤧𞤢𞤪 𞤃𞤫𞤼𞤢 𞤅𞤉𞤌..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                    𞤑𞤢𞤤𞤭𞤥𞤢𞤶𞤫 𞤅𞤉𞤌
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-2 space-x-reverse">
                      <AdlamInput
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="𞤑𞤢𞤤𞤭𞤥𞤢 𞤚𞤢𞤥𞤭..."
                      />
                      <button
                        onClick={addKeyword}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {formData.keywords.map((keyword, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {keyword}
                          <button
                            onClick={() => removeKeyword(keyword)}
                            className="ml-2 text-green-600 hover:text-green-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleEditor;
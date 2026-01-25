import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiSave, HiEye, HiArrowRight } from 'react-icons/hi';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageUpload from '../../components/admin/ImageUpload';
import FulaniInput from '../../components/FulaniInput';
import FulaniTextarea from '../../components/FulaniTextarea';
import { apiService } from '../../services/apiService';

const ArticleForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featured: false,
    published: true
  });
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  const categories = [
    { id: 'litterature', name: '𞤀𞤣𞤢𞤦𞤢𞤲' },
    { id: 'histoire', name: '𞤚𞤢𞤪𞤭𞤲𞤢𞤤' },
    { id: 'education', name: '𞤔𞤢𞤲𞤺𞤢𞤤' },
    { id: 'culture', name: '𞤅𞤢𞤲𞤣𞤭𞤲𞤢𞤤' },
    { id: 'science', name: '𞤅𞤢𞤲𞤣𞤢𞤲𞤣𞤭' },
    { id: 'religion', name: '𞤄𞤭𞤲𞤢𞤤' },
  ];

  useEffect(() => {
    if (isEdit) {
      fetchArticle();
    }
  }, [id, isEdit]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await apiService.articles.getBySlug(id);
      const article = response.data.data?.article || response.data.article;
      setFormData({
        title: article.title || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        category: article.category || '',
        tags: article.tags?.join(', ') || '',
        featured: article.featured || false,
        published: article.status === 'published'
      });
    } catch (error) {
      console.error('Error fetching article:', error);
      alert('Erreur lors du chargement de l\'article');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Ajouter tous les champs du formulaire
      Object.keys(formData).forEach(key => {
        if (key === 'tags') {
          // Convertir la chaîne de tags en array
          const tagsArray = formData[key]
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
          submitData.append('tags', tagsArray.join(','));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Ajouter l'image si présente
      if (coverImage) {
        submitData.append('coverImage', coverImage);
      }

      // Debug: afficher les données envoyées
      console.log('Données envoyées:');
      for (let [key, value] of submitData.entries()) {
        console.log(key, value);
      }

      let response;
      if (isEdit) {
        response = await apiService.articles.update(id, submitData);
      } else {
        response = await apiService.articles.create(submitData);
      }

      console.log('Réponse du serveur:', response.data);
      alert(isEdit ? 'Article mis à jour avec succès!' : 'Article créé avec succès!');
      navigate('/admin/articles');
    } catch (error) {
      console.error('Error saving article:', error);
      console.error('Error response:', error.response?.data);
      alert(`Erreur: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
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
        <div className="flex justify-between items-center mb-8" dir="rtl">
          <div>
            <h1 className="text-3xl font-bold text-black">
              {isEdit ? '𞤻𞤫𞤪𞤲𞤣𞤫 𞤃𞤢𞤦𞤢𞤤' : '𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? '𞤻𞤫𞤪𞤲𞤣𞤫 𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫' : '𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮 𞤸𞤫𞤧𞤮'}
            </p>
          </div>
          <div className="flex space-x-4 space-x-reverse">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <HiEye className="h-5 w-5 ml-2" />
              {previewMode ? '𞤻𞤫𞤪𞤲𞤣𞤫' : '𞤴𞤮𞤲𞤢𞤲'}
            </button>
            <button
              onClick={() => navigate('/admin/articles')}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-black transition-colors"
            >
              <HiArrowRight className="h-5 w-5 ml-2" />
              𞤪𞤵𞤼𞤢𞤲
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title */}
            <div dir="rtl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                𞤀𞤪𞤣𞤫 𞤃𞤢𞤦𞤢𞤤 *
              </label>
              <FulaniInput
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                placeholder="𞤀𞤪𞤣𞤫 𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫..."
                dir="rtl"
              />
            </div>

            {/* Excerpt */}
            <div dir="rtl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                𞤅𞤢𞤪𞤣𞤫 𞤃𞤢𞤦𞤢𞤤
              </label>
              <FulaniTextarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                placeholder="𞤅𞤢𞤪𞤣𞤫 𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫..."
                dir="rtl"
              />
            </div>

            {/* Content Editor */}
            <div dir="rtl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                𞤃𞤢𞤦𞤢𞤤 𞤊𞤮𞤤𞤤𞤢𞤤 *
              </label>
              {previewMode ? (
                <div
                  className="min-h-96 p-4 border border-gray-300 rounded-lg bg-white prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.content }}
                  dir="rtl"
                />
              ) : (
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  placeholder="𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫 𞤸𞤮𞤲𞤢𞤲..."
                />
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cover Image */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg">
              <ImageUpload
                onImageSelect={setCoverImage}
                label="𞤸𞤮𞤪𞤮 𞤃𞤢𞤦𞤢𞤤"
              />
            </div>

            {/* Category */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg" dir="rtl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                𞤊𞤮𞤪𞤲𞤣𞤫 *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                dir="rtl"
              >
                <option value="">𞤊𞤮𞤪𞤲𞤣𞤫 𞤧𞤵𞤦𞤮...</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg" dir="rtl">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                𞤚𞤢𞤺𞤫 (𞤧𞤢𞤪𞤢𞤲 𞤫 𞤳𞤮𞤥𞤢)
              </label>
              <FulaniInput
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
                placeholder="𞤚𞤢𞤺 1, 𞤚𞤢𞤺 2, 𞤚𞤢𞤺 3..."
                dir="rtl"
              />
            </div>

            {/* Options */}
            <div className="bg-white p-6 border border-gray-200 rounded-lg space-y-4" dir="rtl">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label className="mr-2 text-sm text-gray-700">
                  𞤃𞤢𞤦𞤢𞤤 𞤃𞤢𞤱𞤲𞤣𞤫
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="published"
                  checked={formData.published}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label className="mr-2 text-sm text-gray-700">
                  𞤱𞤢𞤤𞤤𞤭𞤲
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <HiSave className="h-5 w-5 ml-2" />
                  {isEdit ? '𞤻𞤫𞤪𞤲𞤣𞤫' : '𞤃𞤢𞤦𞤢𞤤 𞤑𞤫𞤧𞤮'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
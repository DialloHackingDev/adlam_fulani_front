import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { HiSave, HiArrowRight, HiDocument } from 'react-icons/hi';
import FulaniInput from '../../components/FulaniInput';
import FulaniTextarea from '../../components/FulaniTextarea';
import { apiService } from '../../services/apiService';

const DocumentForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    featured: false,
    published: true
  });
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
      fetchDocument();
    }
  }, [id, isEdit]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await apiService.documents.getBySlug(id);
      const document = response.data.data?.document || response.data.document;
      setFormData({
        title: document.title || '',
        description: document.description || '',
        category: document.category || '',
        tags: document.tags?.join(', ') || '',
        featured: document.featured || false,
        published: document.status === 'published'
      });
    } catch (error) {
      console.error('Error fetching document:', error);
      alert('Erreur lors du chargement du document');
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
          const tagsArray = formData[key]
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0);
          submitData.append('tags', tagsArray.join(','));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Ajouter le fichier si présent
      if (documentFile) {
        submitData.append('documentFile', documentFile);
      }

      let response;
      if (isEdit) {
        response = await apiService.documents.update(id, submitData);
      } else {
        response = await apiService.documents.create(submitData);
      }

      console.log('Réponse du serveur:', response.data);
      alert(isEdit ? 'Document mis à jour avec succès!' : 'Document créé avec succès!');
      navigate('/admin/documents');
    } catch (error) {
      console.error('Error saving document:', error);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérifier le type de fichier
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Seuls les fichiers PDF et Word sont acceptés');
        return;
      }
      setDocumentFile(file);
    }
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8" dir="rtl">
          <div>
            <h1 className="text-3xl font-bold text-black">
              {isEdit ? '𞤻𞤫𞤪𞤲𞤣𞤫 𞤃𞤢𞤦𞤢𞤤 𞤚𞤢𞤪𞤭𞤲𞤢𞤤' : '𞤃𞤢𞤦𞤢𞤤 𞤚𞤢𞤪𞤭𞤲𞤢𞤤 𞤑𞤫𞤧𞤮'}
            </h1>
            <p className="text-gray-600 mt-2">
              {isEdit ? '𞤻𞤫𞤪𞤲𞤣𞤫 𞤃𞤢𞤦𞤢𞤤 𞤚𞤢𞤪𞤭𞤲𞤢𞤤 𞤲𞤣𞤫' : '𞤃𞤢𞤦𞤢𞤤 𞤚𞤢𞤪𞤭𞤲𞤢𞤤 𞤑𞤫𞤧𞤮 𞤸𞤫𞤧𞤮'}
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/documents')}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-black transition-colors"
          >
            <HiArrowRight className="h-5 w-5 ml-2" />
            𞤪𞤵𞤼𞤢𞤲
          </button>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
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

          {/* Description */}
          <div dir="rtl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              𞤅𞤢𞤪𞤣𞤫 𞤃𞤢𞤦𞤢𞤤
            </label>
            <FulaniTextarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right"
              placeholder="𞤅𞤢𞤪𞤣𞤫 𞤃𞤢𞤦𞤢𞤤 𞤲𞤣𞤫..."
              dir="rtl"
            />
          </div>

          {/* File Upload */}
          <div dir="rtl">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              𞤊𞤢𞤴𞤤 𞤃𞤢𞤦𞤢𞤤 *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <HiDocument className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <label className="cursor-pointer">
                  <span className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                    𞤧𞤵𞤦𞤮 𞤊𞤢𞤴𞤤
                  </span>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    required={!isEdit}
                  />
                </label>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX (Max 10MB)</p>
                {documentFile && (
                  <p className="text-sm text-green-600">✓ {documentFile.name}</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category */}
            <div dir="rtl">
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
            <div dir="rtl">
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
          </div>

          {/* Options */}
          <div className="flex space-x-6 space-x-reverse" dir="rtl">
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
          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="bg-black text-white py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

export default DocumentForm;
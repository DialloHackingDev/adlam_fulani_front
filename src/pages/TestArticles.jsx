import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const TestArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching articles...');
        
        const response = await apiService.articles.getAll();
        console.log('Full response:', response);
        console.log('Response data:', response.data);
        console.log('Response data data:', response.data.data);
        
        const articlesData = response.data.data?.articles || [];
        console.log('Articles data:', articlesData);
        
        setArticles(articlesData);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8">Erreur: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📰 Test Articles</h1>
      <p>Nombre d'articles: {articles.length}</p>
      
      {articles.map(article => (
        <div key={article._id} className="border p-4 rounded mb-4">
          <h2 className="font-bold text-lg">{article.title}</h2>
          <p className="text-sm text-gray-600">
            Auteur: {article.author?.name || 'Inconnu'}
          </p>
          <p className="text-sm">{article.excerpt}</p>
        </div>
      ))}
    </div>
  );
};

export default TestArticles;

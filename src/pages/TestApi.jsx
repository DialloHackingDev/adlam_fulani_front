import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const TestApi = () => {
  const [articles, setArticles] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching data...');
        
        const [articlesResponse, ebooksResponse] = await Promise.all([
          apiService.articles.getAll(),
          apiService.ebooks.getAll()
        ]);
        
        console.log('Articles response:', articlesResponse.data);
        console.log('Ebooks response:', ebooksResponse.data);
        
        setArticles(articlesResponse.data.data?.articles || []);
        setEbooks(ebooksResponse.data.data?.ebooks || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test API</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Articles ({articles.length})</h2>
        <div className="space-y-2">
          {articles.map(article => (
            <div key={article._id} className="border p-4 rounded">
              <h3 className="font-bold">{article.title}</h3>
              <p className="text-sm text-gray-600">{article.excerpt}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Ebooks ({ebooks.length})</h2>
        <div className="space-y-2">
          {ebooks.map(ebook => (
            <div key={ebook._id} className="border p-4 rounded">
              <h3 className="font-bold">{ebook.title}</h3>
              <p className="text-sm text-gray-600">{ebook.author}</p>
              <p className="text-sm">Prix: {ebook.price} GNF</p>
              {ebook.coverImage && (
                <img 
                  src={ebook.coverImage.startsWith('http') ? ebook.coverImage : `http://localhost:5000${ebook.coverImage}`}
                  alt={ebook.title}
                  className="w-16 h-20 object-cover mt-2"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestApi;

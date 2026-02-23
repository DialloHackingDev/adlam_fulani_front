import { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';

const HomeSimple = () => {
  const [data, setData] = useState({ articles: [], ebooks: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [articlesResponse, ebooksResponse] = await Promise.all([
          apiService.articles.getAll(),
          apiService.ebooks.getAll()
        ]);
        
        
        const articles = articlesResponse.data.data?.articles || [];
        const ebooks = ebooksResponse.data.data?.ebooks || [];
        
        
        setData({ articles, ebooks });
      } catch (err) {
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
      <h1 className="text-2xl font-bold mb-8">📚 Adlam - Accueil</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">📰 Articles ({data.articles.length})</h2>
        {data.articles.length === 0 ? (
          <p>Aucun article trouvé</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.articles.map(article => (
              <div key={article._id} className="border p-4 rounded-lg">
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Par: {article.author?.name || 'Auteur inconnu'}
                </p>
                <p className="text-sm text-gray-500 mb-2">
                  Catégorie: {article.category}
                </p>
                {article.excerpt && (
                  <p className="text-sm mb-2">{article.excerpt}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-4">📚 Ebooks ({data.ebooks.length})</h2>
        {data.ebooks.length === 0 ? (
          <p>Aucun ebook trouvé</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.ebooks.map(ebook => (
              <div key={ebook._id} className="border p-4 rounded-lg">
                {ebook.coverImage && (
                  <img 
                    src={ebook.coverImage.startsWith('http') ? ebook.coverImage : `http://localhost:5000${ebook.coverImage}`}
                    alt={ebook.title}
                    className="w-full h-32 object-cover mb-2"
                  />
                )}
                <h3 className="font-bold text-lg mb-2">{ebook.title}</h3>
                <p className="text-sm text-gray-600 mb-2">Par: {ebook.author}</p>
                <p className="text-sm font-semibold">Prix: {ebook.price} GNF</p>
                <p className="text-sm text-gray-500">Catégorie: {ebook.category}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeSimple;

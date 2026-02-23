import React, { useState, useEffect } from 'react';

const Diagnostic = () => {
  const [apiStatus, setApiStatus] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPIs = async () => {
      try {
        const tests = {
          articles: false,
          ebooks: false,
          auth: false,
          documents: false
        };

        // Test articles
        try {
          const response = await fetch('http://localhost:5000/api/v1/articles');
          tests.articles = response.ok;
        } catch (e) {
        }

        // Test ebooks
        try {
          const response = await fetch('http://localhost:5000/api/v1/ebooks');
          tests.ebooks = response.ok;
        } catch (e) {
        }

        // Test auth
        try {
          const response = await fetch('http://localhost:5000/api/v1/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@test.com', password: 'test' })
          });
          tests.auth = response.status !== 0;
        } catch (e) {
        }

        // Test documents
        try {
          const response = await fetch('http://localhost:5000/api/v1/documents');
          tests.documents = response.ok;
        } catch (e) {
        }

        setApiStatus(tests);
      } catch (err) {
        setError(err.message);
      }
    };

    testAPIs();
  }, []);

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600 mb-4">❌ Erreur de Diagnostic</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">🔍 Diagnostic Adlam</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">📊 Statut des APIs</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Articles:</span>
              <span className={apiStatus.articles ? 'text-green-600' : 'text-red-600'}>
                {apiStatus.articles ? '✅ OK' : '❌ Erreur'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Ebooks:</span>
              <span className={apiStatus.ebooks ? 'text-green-600' : 'text-red-600'}>
                {apiStatus.ebooks ? '✅ OK' : '❌ Erreur'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Authentification:</span>
              <span className={apiStatus.auth ? 'text-green-600' : 'text-red-600'}>
                {apiStatus.auth ? '✅ OK' : '❌ Erreur'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Documents:</span>
              <span className={apiStatus.documents ? 'text-green-600' : 'text-red-600'}>
                {apiStatus.documents ? '✅ OK' : '❌ Erreur'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">🔗 Liens Rapides</h2>
          <div className="space-y-2">
            <a href="/home" className="block text-blue-600 hover:underline">🏠 Accueil</a>
            <a href="/articles" className="block text-blue-600 hover:underline">📰 Articles</a>
            <a href="/library" className="block text-blue-600 hover:underline">📚 Bibliothèque</a>
            <a href="/admin/login" className="block text-blue-600 hover:underline">🔐 Admin</a>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">📝 Informations Système</h2>
        <div className="space-y-2 text-sm">
          <div><strong>Frontend:</strong> http://localhost:5173</div>
          <div><strong>Backend:</strong> http://localhost:5000</div>
          <div><strong>API Base:</strong> http://localhost:5000/api/v1</div>
          <div><strong>React:</strong> {React.version}</div>
        </div>
      </div>
    </div>
  );
};

export default Diagnostic;

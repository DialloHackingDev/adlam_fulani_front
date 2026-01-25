const TestMinimal = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">🧪 Test Minimal</h1>
      <p>Si vous voyez ceci, React fonctionne !</p>
      <div className="mt-4">
        <h2>Test API:</h2>
        <button 
          onClick={() => {
            fetch('http://localhost:5000/api/v1/articles')
              .then(res => res.json())
              .then(data => console.log('API Response:', data))
              .catch(err => console.error('API Error:', err));
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Tester l'API
        </button>
      </div>
    </div>
  );
};

export default TestMinimal;

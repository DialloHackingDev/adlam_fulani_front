import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function TestBasic() {
  return <div>Hello World - Test Simple</div>;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/" element={<TestBasic />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

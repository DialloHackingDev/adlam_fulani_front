import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import Articles from './pages/Articles';
import Library from './pages/Library';
import Cart from './pages/Cart';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ArticleForm from './pages/admin/ArticleForm';
import EbookForm from './pages/admin/EbookForm';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <Home />
                </>
              } />
              <Route path="/articles" element={
                <>
                  <Header />
                  <Articles />
                </>
              } />
              <Route path="/library" element={
                <>
                  <Header />
                  <Library />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <Header />
                  <Cart />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Header />
                  <Contact />
                </>
              } />
              
              {/* Admin Login */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/articles" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/articles/new" element={
                <ProtectedRoute>
                  <ArticleForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/articles/edit/:id" element={
                <ProtectedRoute>
                  <ArticleForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/ebooks" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/ebooks/new" element={
                <ProtectedRoute>
                  <EbookForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/ebooks/edit/:id" element={
                <ProtectedRoute>
                  <EbookForm />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
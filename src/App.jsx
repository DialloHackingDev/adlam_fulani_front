import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Library from './pages/Library';
import EbookDetail from './pages/EbookDetail';
import Cart from './pages/Cart';
import CheckoutSuccess from './pages/CheckoutSuccess';
import MyLibrary from './pages/MyLibrary';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ArticleForm from './pages/admin/ArticleForm';
import EbookForm from './pages/admin/EbookForm';
import DocumentForm from './pages/admin/DocumentForm';

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
              <Route path="/articles/:slug" element={
                <>
                  <Header />
                  <ArticleDetail />
                </>
              } />
              <Route path="/library/:slug" element={
                <>
                  <Header />
                  <EbookDetail />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <Header />
                  <Cart />
                </>
              } />
              <Route path="/checkout/success" element={
                <>
                  <Header />
                  <CheckoutSuccess />
                </>
              } />
              <Route path="/my-library" element={
                <ProtectedRoute>
                  <Header />
                  <MyLibrary />
                </ProtectedRoute>
              } />
              <Route path="/contact" element={
                <>
                  <Header />
                  <Contact />
                </>
              } />
              <Route path="/admin/login" element={<AdminLogin />} />
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
              <Route path="/admin/documents" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/documents/new" element={
                <ProtectedRoute>
                  <DocumentForm />
                </ProtectedRoute>
              } />
              <Route path="/admin/documents/edit/:id" element={
                <ProtectedRoute>
                  <DocumentForm />
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, { UserProtectedRoute } from './components/ProtectedRoute';
import Header from './components/Header';
import OfflineBanner from './components/OfflineBanner';
import Footer from './components/Footer';
import Home from './pages/Home';
import Articles from './pages/Articles';
import ArticleDetail from './pages/ArticleDetail';
import Ebooks from './pages/Ebooks';
import EbookDetail from './pages/EbookDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import MyLibrary from './pages/MyLibrary';
import EbookReader from './pages/EbookReader';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ArticleEditor from './pages/ArticleEditor';
import EbookEditor from './pages/EbookEditor';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <OfflineBanner />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <Home />
                  <Footer />
                </>
              } />
              <Route path="/articles" element={
                <>
                  <Header />
                  <Articles />
                  <Footer />
                </>
              } />
              <Route path="/articles/:slug" element={
                <>
                  <Header />
                  <ArticleDetail />
                  <Footer />
                </>
              } />
              <Route path="/ebooks" element={
                <>
                  <Header />
                  <Ebooks />
                  <Footer />
                </>
              } />
              <Route path="/ebooks/:slug" element={
                <>
                  <Header />
                  <EbookDetail />
                  <Footer />
                </>
              } />
              <Route path="/login" element={
                <>
                  <Header />
                  <Login />
                  <Footer />
                </>
              } />
              <Route path="/register" element={
                <>
                  <Header />
                  <Register />
                  <Footer />
                </>
              } />
              <Route path="/cart" element={
                <>
                  <Header />
                  <Cart />
                  <Footer />
                </>
              } />
              <Route path="/checkout" element={
                <UserProtectedRoute>
                  <Header />
                  <Checkout />
                  <Footer />
                </UserProtectedRoute>
              } />
              <Route path="/checkout/success" element={
                <>
                  <Header />
                  <CheckoutSuccess />
                  <Footer />
                </>
              } />
              <Route path="/my-library" element={
                <UserProtectedRoute>
                  <Header />
                  <MyLibrary />
                  <Footer />
                </UserProtectedRoute>
              } />
              <Route path="/ebook-reader/:id" element={
                <UserProtectedRoute>
                  <EbookReader />
                </UserProtectedRoute>
              } />
              <Route path="/contact" element={
                <>
                  <Header />
                  <Contact />
                  <Footer />
                </>
              } />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/articles/new" element={
                <ProtectedRoute>
                  <ArticleEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/articles/edit/:id" element={
                <ProtectedRoute>
                  <ArticleEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/ebooks/new" element={
                <ProtectedRoute>
                  <EbookEditor />
                </ProtectedRoute>
              } />
              <Route path="/admin/ebooks/edit/:id" element={
                <ProtectedRoute>
                  <EbookEditor />
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
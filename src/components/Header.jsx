import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX, HiSearch, HiShoppingCart, HiUser, HiLogout, HiBell } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { count } = useCart();
  const { user, logout } = useAuth();

  // Détecter le scroll pour l'effet de transparence
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer les menus lors du changement de route
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location]);

  const navigation = [
    { name: '𞤄𞤢𞤤𞤤𞤢𞤤', href: '/', current: location.pathname === '/' },
    { name: '𞤃𞤢𞤦𞤢𞤤𞤫', href: '/articles', current: location.pathname === '/articles' },
    { name: '𞤃𞤫𞤧𞤫', href: '/ebooks', current: location.pathname === '/ebooks' },
    { name: '𞤔𞤮𞤲𞤲𞤣𞤭', href: '/contact', current: location.pathname === '/contact' },
  ];

  // Ajouter l'onglet Admin si l'utilisateur est admin
  if (user && user.role === 'admin') {
    navigation.push({ name: '⚙️ 𞤀𞤣𞤥𞤭𞤲', href: '/admin', current: location.pathname.startsWith('/admin') });
  }

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200/50' 
          : 'bg-white border-b border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link 
                to="/" 
                className="text-xl sm:text-2xl font-bold text-black hover:text-gray-700 transition-colors duration-300 transform hover:scale-105"
              >
                𞤀𞤣𞤤𞤢𞤥
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 space-x-reverse">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative px-3 xl:px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg group ${
                    item.current
                      ? 'text-black bg-gray-100'
                      : 'text-gray-600 hover:text-black hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                  {item.current && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                  )}
                </Link>
              ))}
            </nav>

            {/* Right side icons */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4 space-x-reverse">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  isSearchOpen 
                    ? 'text-black bg-gray-100' 
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
              >
                <HiSearch className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>

              {/* Cart */}
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-full transition-all duration-300 transform hover:scale-110 group"
              >
                <HiShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse group-hover:animate-bounce">
                    {count}
                  </span>
                )}
              </Link>

              {/* User Menu */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-1 sm:space-x-2 space-x-reverse p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-gray-600 to-black rounded-full flex items-center justify-center">
                      <HiUser className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
                    </div>
                    <span className="hidden md:block text-sm font-medium max-w-20 truncate" dir="rtl">{user.name}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 animate-in slide-in-from-top-2 duration-200">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900" dir="rtl">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/my-library"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          dir="rtl"
                        >
                          <span>𞤃𞤫𞤧𞤫 𞤀𞤥</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2 space-x-reverse"
                          dir="rtl"
                        >
                          <HiLogout className="h-4 w-4" />
                          <span>𞤊𞤭𞤼𞤢𞤤</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2 space-x-reverse">
                  <Link
                    to="/login"
                    className="px-3 lg:px-4 py-2 text-sm font-medium text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-300"
                    dir="rtl"
                  >
                    𞤔𞤮𞤲𞤲𞤣𞤭
                  </Link>
                  <Link
                    to="/register"
                    className="px-3 lg:px-4 py-2 text-sm font-medium bg-gradient-to-r from-black to-gray-800 text-white rounded-lg hover:from-gray-800 hover:to-black transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    dir="rtl"
                  >
                    𞤅𞤮𞤧𞤢𞤲
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-black hover:bg-gray-50 rounded-full transition-all duration-300 transform hover:scale-110"
              >
                <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                  <span className={`absolute inset-0 transition-all duration-300 ${
                    isMenuOpen ? 'rotate-45 opacity-100' : 'rotate-0 opacity-100'
                  }`}>
                    {isMenuOpen ? <HiX className="w-full h-full" /> : <HiMenu className="w-full h-full" />}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isSearchOpen ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
          }`}>
            <div className="py-3 sm:py-4 border-t border-gray-100">
              <div className="relative">
                <input
                  type="text"
                  placeholder="𞤧𞤢𞤦𞤼𞤮 𞤫 𞤃𞤢𞤦𞤢𞤤𞤫 𞤫 𞤣𞤫𞤬𞤼𞤫..."
                  className="w-full px-3 sm:px-4 py-3 pr-10 sm:pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-right text-sm sm:text-base transition-all duration-300 hover:border-gray-300"
                  dir="rtl"
                  autoFocus
                />
                <HiSearch className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className={`fixed inset-0 z-40 lg:hidden transition-all duration-300 ${
        isMenuOpen ? 'visible' : 'invisible'
      }`}>
        <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-50' : 'opacity-0'
        }`} onClick={() => setIsMenuOpen(false)}></div>
        
        <div className={`absolute top-14 sm:top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl transform transition-all duration-300 ${
          isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          <div className="px-3 pt-4 pb-6 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium transition-all duration-300 rounded-xl ${
                  item.current
                    ? 'text-black bg-gray-100 shadow-sm'
                    : 'text-gray-600 hover:text-black hover:bg-gray-50'
                }`}
                dir="rtl"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Auth Links */}
            {!user && (
              <div className="pt-4 mt-4 border-t border-gray-100 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-600 hover:text-black hover:bg-gray-50 transition-all duration-300 rounded-xl"
                  dir="rtl"
                >
                  𞤔𞤮𞤲𞤲𞤣𞤭
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium bg-gradient-to-r from-black to-gray-800 text-white hover:from-gray-800 hover:to-black transition-all duration-300 rounded-xl text-center shadow-lg"
                  dir="rtl"
                >
                  𞤅𞤮𞤧𞤢𞤲
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Spacer pour compenser le header fixe */}
      <div className="h-14 sm:h-16"></div>
    </>
  );
};

export default Header;
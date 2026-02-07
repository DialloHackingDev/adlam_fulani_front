import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiEye, HiEyeOff, HiLockClosed, HiMail } from 'react-icons/hi';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || 'خطأ في تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center" dir="rtl">
          <h2 className="text-4xl font-bold text-black mb-2">
            𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤲𞤣𞤢𞤲
          </h2>
          <p className="text-gray-600 text-lg">
            𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤲𞤣𞤢𞤲 𞤫 𞤑𞤢𞤪𞤢𞤲 𞤃𞤫𞤧𞤫 𞤀𞤣𞤤𞤢𞤥
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                𞤄𞤢𞤪𞤭𞤣 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pr-10 pl-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:z-10"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2" dir="rtl">
                𞤑𞤮𞤣 𞤅𞤭𞤪𞤭
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full pr-10 pl-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent focus:z-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 left-0 pl-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <HiEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span dir="rtl">𞤔𞤢𞤪𞤭 𞤸𞤢𞤤𞤢𞤲𞤣𞤫...</span>
                  </div>
                ) : (
                  <span dir="rtl">𞤔𞤮𞤲𞤲𞤣𞤭</span>
                )}
              </button>
            </div>

            {/* Links */}
            <div className="text-center space-y-4">
              <div>
                <Link
                  to="/register"
                  className="text-black hover:text-gray-600 transition-colors font-medium"
                  dir="rtl"
                >
                  𞤀𞤤𞤢 𞤸𞤫𞤧𞤮 𞤸𞤢𞤧𞤢𞤦? 𞤅𞤮𞤧𞤢𞤲 𞤸𞤢𞤧𞤢𞤦 𞤸𞤫𞤧𞤮
                </Link>
              </div>
              <div>
                <Link
                  to="/"
                  className="text-gray-500 hover:text-gray-700 transition-colors text-sm"
                  dir="rtl"
                >
                  𞤪𞤵𞤼𞤢𞤲 𞤫 𞤀𞤧𞤵𞤤
                </Link>
              </div>
            </div>
          </form>
        </div>

        {/* Info */}
        <div className="text-center">
          <p className="text-sm text-gray-600" dir="rtl">
            𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤑𞤢𞤪𞤢𞤲 𞤃𞤫𞤧𞤫 𞤫 𞤧𞤢𞤴𞤢𞤲 𞤃𞤫𞤧𞤫 𞤀𞤣𞤤𞤢𞤥
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
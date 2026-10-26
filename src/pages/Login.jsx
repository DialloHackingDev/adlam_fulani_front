import { Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import LoginForm from '../components/auth/LoginForm';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Page demandée avant la redirection vers la connexion (lecteur, paiement...)
  const from = location.state?.from || '/';

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const handleLogin = async (email, password) => {
    await login(email, password);
    navigate(from, { replace: true });
  };

  return (
    <AuthLayout
      title="𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤲𞤣𞤢𞤲"
      subtitle="𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤲𞤣𞤢𞤲 𞤫 𞤑𞤢𞤪𞤢𞤲 𞤃𞤫𞤧𞤫 𞤀𞤣𞤤𞤢𞤥"
      footer={
        <Link to="/" className="transition-colors hover:text-gray-900">
          𞤪𞤵𞤼𞤢𞤲 𞤫 𞤀𞤧𞤵𞤤
        </Link>
      }
    >
      <LoginForm
        onSubmit={handleLogin}
        submitLabel="𞤔𞤮𞤲𞤲𞤣𞤭"
        emailLabel="𞤄𞤢𞤪𞤭𞤣 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳"
        passwordLabel="𞤑𞤮𞤣 𞤅𞤭𞤪𞤭"
        emailPlaceholder="example@email.com"
      >
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-100" />
          </div>
        </div>
        <Link
          to="/register"
          state={location.state}
          className="block w-full rounded-xl border border-gray-200 px-4 py-3 text-center font-medium text-gray-900 transition-all duration-200 hover:border-gray-900 hover:bg-gray-50"
        >
          𞤀𞤤𞤢 𞤸𞤫𞤧𞤮 𞤸𞤢𞤧𞤢𞤦? 𞤅𞤮𞤧𞤢𞤲 𞤸𞤢𞤧𞤢𞤦 𞤸𞤫𞤧𞤮
        </Link>
      </LoginForm>
    </AuthLayout>
  );
};

export default Login;

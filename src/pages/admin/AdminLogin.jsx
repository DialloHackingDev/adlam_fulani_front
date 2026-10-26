import { Navigate, useNavigate } from 'react-router-dom';
import { HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';
import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';

const AdminLogin = () => {
  const { login, logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated && user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = async (email, password) => {
    const loggedUser = await login(email, password);

    // Un compte non admin ne doit pas rester connecté depuis cet écran
    if (loggedUser.role !== 'admin') {
      logout();
      const error = new Error('admin-only');
      error.response = { data: { message: 'Accès réservé aux administrateurs' } };
      throw error;
    }

    navigate('/admin', { replace: true });
  };

  return (
    <AuthLayout
      fullHeight
      icon={<HiLockClosed className="h-6 w-6" />}
      title="𞤃𞤢𞤪𞤸𞤢𞤤 𞤀𞤣𞤥𞤭𞤲"
      subtitle="𞤐𞤢𞤲𞤺𞤫 𞤫 𞤧𞤢𞤪𞤢 𞤸𞤢𞤤𞤢𞤲𞤣𞤫 𞤃𞤢𞤪𞤸𞤢𞤤"
    >
      <LoginForm
        onSubmit={handleLogin}
        submitLabel="𞤸𞤢𞤤𞤢𞤲"
        emailLabel="𞤉𞤢𞤤𞤢 𞤉𞤤𞤫𞤳𞤼𞤮𞤪𞤮𞤲𞤭𞤳"
        passwordLabel="𞤅𞤢𞤪𞤢 𞤸𞤢𞤤𞤢𞤲𞤣𞤫"
        emailPlaceholder="admin@example.com"
      />
    </AuthLayout>
  );
};

export default AdminLogin;

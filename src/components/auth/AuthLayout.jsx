import { Link } from 'react-router-dom';

// Mise en page commune aux écrans de connexion : panneau de marque + carte de formulaire
const AuthLayout = ({ title, subtitle, icon, children, footer, fullHeight = false }) => {
  return (
    <div
      className={`${fullHeight ? 'min-h-screen' : 'min-h-[calc(100vh-4rem)]'} grid lg:grid-cols-2 bg-white`}
    >
      {/* Formulaire */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-8">
        <div className="w-full max-w-md auth-enter">
          <div className="mb-8 text-center lg:text-left">
            {icon && (
              <div className="mx-auto lg:mx-0 mb-5 h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                {icon}
              </div>
            )}
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && <p className="mt-3 text-gray-500 leading-relaxed">{subtitle}</p>}
          </div>

          <div className="bg-white sm:rounded-2xl sm:border sm:border-gray-100 sm:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.15)] sm:p-8">
            {children}
          </div>

          {footer && <div className="mt-6 text-center text-sm text-gray-500">{footer}</div>}
        </div>
      </div>

      {/* Panneau de marque (grand écran uniquement) */}
      <div className="hidden lg:flex relative overflow-hidden bg-black text-white items-center justify-center p-12">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 40%),' +
              'radial-gradient(circle at 80% 70%, rgba(255,255,255,0.12), transparent 45%)'
          }}
        />
        <div aria-hidden="true" className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full border border-white/10" />
        <div aria-hidden="true" className="absolute -top-16 -right-16 h-72 w-72 rounded-full border border-white/10" />

        <div className="relative max-w-sm text-center">
          <Link to="/" className="inline-block text-6xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            𞤀𞤣𞤤𞤢𞤥
          </Link>
          <p className="mt-6 text-lg text-white/70 leading-relaxed">
            𞤔𞤮𞤲𞤲𞤣𞤭 𞤫 𞤑𞤢𞤪𞤢𞤲 𞤃𞤫𞤧𞤫 𞤫 𞤧𞤢𞤴𞤢𞤲 𞤃𞤫𞤧𞤫 𞤀𞤣𞤤𞤢𞤥
          </p>
          <div className="mt-10 flex justify-center gap-3" aria-hidden="true">
            <span className="h-1.5 w-8 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

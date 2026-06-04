// src/pages/LoginPage.jsx
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[--color-sw-blue]">
      <div className="text-center px-6">
        {/* Sport Wales Logo */}
        <div className="mb-8">
          <img
            src="/images/sport-wales-logo.svg"
            alt="Sport Wales"
            className="h-16 mx-auto brightness-0 invert"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNTAiPjx0ZXh0IHg9IjEwIiB5PSIzMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZmZmZmZmIj5TcG9ydCBXYWxlczwvdGV4dD48L3N2Zz4=';
            }}
          />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-extrabold text-white mb-3">
          Integrated Impact Assessment
        </h1>
        <p className="text-white/70 mb-10 text-lg">
          Log in with your Sport Wales account to continue.
        </p>

        {/* Login Button */}
        <button
          onClick={login}
          className="inline-flex items-center px-8 py-3 rounded-md text-base font-semibold bg-white text-[--color-sw-blue] hover:bg-gray-100 transition-colors duration-200 shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 23 23" fill="none">
            <path fill="#f35325" d="M1 1h10v10H1z"/>
            <path fill="#81bc06" d="M12 1h10v10H12z"/>
            <path fill="#05a6f0" d="M1 12h10v10H1z"/>
            <path fill="#ffba08" d="M12 12h10v10H12z"/>
          </svg>
          Log in with Microsoft
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
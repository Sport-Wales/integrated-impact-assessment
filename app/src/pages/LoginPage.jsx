// src/pages/LoginPage.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

  // Real auth (Azure) — redirect immediately to Microsoft login.
  // Background image shows briefly while the redirect happens.
  // Local mock auth — this effect does nothing, card renders below.
  useEffect(() => {
    if (!useMockAuth) {
      window.location.href = '/.auth/login/aad';
    }
  }, [useMockAuth]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Full-bleed background image */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/login_image.webp')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Login card — local mock auth only */}
      {useMockAuth && (
      <div className="relative z-10 bg-white px-10 py-10 w-full max-w-md mx-4 rounded">
        {/* Sport Wales Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="https://raw.githubusercontent.com/Sport-Wales/sport-wales-design-assets/main/logos/Sport_Wales_Logo_Red.png"
            alt="Sport Wales"
            className="h-20"
          />
        </div>

        {/* Heading */}
        <h1 className="text-xl font-semibold text-gray-900 mb-6">
          Sign in with your email address
        </h1>

        {/* Email field */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-800 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Password field */}
        <div className="mb-3">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded text-gray-800 text-sm focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Sign in button — calls login() regardless of field values for now */}
        <button
          onClick={login}
          className="w-full py-3 mt-3 bg-[#0067b8] hover:bg-[#005a9e] text-white text-sm font-semibold rounded transition-colors duration-200 mb-4"
        >
          Sign in
        </button>
      </div>
      )}
    </div>
  );
};

export default LoginPage;

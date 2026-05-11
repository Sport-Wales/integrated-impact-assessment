import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const useMockAuth = import.meta.env.VITE_USE_MOCK_AUTH === 'true';

  useEffect(() => {
    const fetchAuthStatus = async () => {
      // Use mock auth for pure local development
      if (useMockAuth) {
        console.log('[Auth] Using mock authentication');
        setUser({
          userId: 'LOCAL_DEV_USER',
          userDetails: 'Dev User',
          userRoles: ['authenticated', 'user']
        });
        setLoading(false);
        return;
      }

      // Fetch real auth from Azure SWA
      try {
        const response = await fetch('/.auth/me');
        
        if (!response.ok) {
          throw new Error(`Auth failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.clientPrincipal) {
          setUser(data.clientPrincipal);
          setError(null);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('[Auth] Error:', err);
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthStatus();
  }, [useMockAuth]);

  const login = () => {
    window.location.href = '/.auth/login/aad';
  };

  const logout = () => {
    window.location.href = '/.auth/logout';
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const ProtectedRoute = ({ children }) => {
  const { user, setUser, checkAuth } = useAuth();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(
    location.state?.user ? true : null
  );

  useEffect(() => {
    if (location.state?.user) {
      setUser(location.state.user);
      setIsAuthenticated(true);
      return;
    }

    if (user) {
      setIsAuthenticated(true);
      return;
    }

    const verify = async () => {
      try {
        await checkAuth();
        setIsAuthenticated(true);
      } catch {
        setIsAuthenticated(false);
      }
    };

    verify();
  }, [location.state, user, checkAuth, setUser]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
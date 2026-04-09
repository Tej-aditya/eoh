import { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

const ProtectedRoute = ({ children }) => {
  const { user, setUser } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      // If user is already set from context, we're authenticated
      if (user) {
        setIsChecking(false);
        return;
      }

      // If user came from location state (e.g., after login redirect)
      if (location.state?.user) {
        setUser(location.state.user);
        setIsChecking(false);
        return;
      }

      // Check if we have a token and verify it
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsChecking(false);
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          // Token invalid, clear it
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      setIsChecking(false);
    };

    verifyAuth();
  }, [location.state, user, setUser]);

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#00f2fe] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If no user after checking, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
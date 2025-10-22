import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const useBlockNavigation = () => {
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const currentPath = location.pathname;
    
    window.history.pushState(null, '', currentPath);

    const handlePopState = (event) => {
      console.log('🔙 Usuario presionó flecha atrás. Redirigiendo a Google...');
      window.location.href = 'https://www.google.com';
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [user, location.pathname]);
};

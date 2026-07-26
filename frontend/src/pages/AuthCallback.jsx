import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/ui/Loader';

/**
 * Handles the redirect from GitHub OAuth.
 * The backend sends: /auth/callback?token=<jwt>
 * This page reads the token from the URL, stores it via AuthContext, then redirects.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      navigate(`/login?error=${error}`);
      return;
    }

    if (token) {
      loginWithToken(token).then(() => {
        navigate('/dashboard', { replace: true });
      });
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen cp-page">
      <div className="text-center space-y-4">
        <Loader size="lg" />
        <p className="cp-text-secondary text-sm">Completing sign-in…</p>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';

export default function useAuth(initialUser = null, options = {}) {
  const { enableServerAuth = true } = options;
  const [user, setUser] = useState(initialUser);
  const [configured, setConfigured] = useState({ google: false, github: false });

  useEffect(() => {
    if (!enableServerAuth) return undefined;

    let isCancelled = false;

    const loadCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
          headers: {
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          if (!isCancelled) {
            setUser(null);
          }
          return;
        }

        const contentType = response.headers.get('content-type') || '';
        if (!contentType.includes('application/json')) {
          if (!isCancelled) {
            setUser(null);
            setConfigured({ google: false, github: false });
          }
          return;
        }

        const data = await response.json();

        if (!isCancelled) {
          setUser(data.user || null);
          setConfigured(data.configured || { google: false, github: false });
        }
      } catch (error) {
        console.error('Error loading auth user:', error);
      }
    };

    loadCurrentUser();

    return () => {
      isCancelled = true;
    };
  }, [enableServerAuth]);

  const signIn = (provider) => {
    if (typeof window === 'undefined') return;

    if (provider !== 'google' && provider !== 'github') return;

    window.location.href = `/auth/${provider}`;
  };

  const signOut = () => {
    if (typeof window === 'undefined') return;

    window.location.href = '/auth/logout';
  };

  return {
    user,
    configured,
    signIn,
    signOut,
  };
}
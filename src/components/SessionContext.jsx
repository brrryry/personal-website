// components/SessionContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const SessionContext = createContext();

export function SessionProvider({children}) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    //get "sessionid" cookie
    const sessionid = document.cookie.split('; ').find(row => row.startsWith('sessionid='))?.split('=')[1];
    const fetchSession = async (sessionid) => {
      try {
        //post request to /api/account/session
        const response = await fetch('/api/account/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: sessionid }),
        });
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error('error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSession(sessionid);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('/api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'login failed');
      }

      document.cookie = `sessionid=${data.sessionId}; path=/; max-age=604800;`; // 7 days

      setSession(data);
    } catch (error) {
      throw new Error(error.message.toLowerCase());
    }
  }

  const logout = async () => {
    try {
      const response = await fetch('/api/account/logout', {
        method: 'POST',
        body: JSON.stringify({ sessionId: session?.sessionId }),
      });

      if (!response.ok) {
        throw new Error('logout failed');
      }

      // Clear the session cookie
      document.cookie = 'sessionid=; path=/; max-age=0;'; // Clear the cookie

      setSession(null);
    } catch (error) {
      console.error('logout error:', error);
    }
  };

  return (
    <SessionContext.Provider value={{ session, loading, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
import React, { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, getIdToken, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext({ user: null, loading: true });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ensure persistent session (localStorage)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {});
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // helper to get ID token when needed
  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  return (
    <AuthContext.Provider value={{ user, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// convenience hook
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
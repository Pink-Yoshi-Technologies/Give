import React, { createContext, useEffect, useState, useContext } from 'react';
import { onAuthStateChanged, getIdToken, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth } from '../firebase';

/**
 * AuthContext module
 *
 * Provides a React context that exposes the currently authenticated Firebase user,
 * a loading flag while the initial auth state is being determined, and a helper
 * to obtain the user's ID token for authenticated backend requests.
 *
 * Consumers should wrap their app with <AuthProvider> and use useAuth() to access
 * the context values.
 *
 * @module AuthContext
 */

// create context with simple default shape: user (null when not signed in) & loading flag
const AuthContext = createContext({ user: null, loading: true });

/**
 * AuthProvider component
 *
 * Wrap your application with this provider to subscribe to Firebase auth state.
 * It ensures session persistence, listens for auth state changes, and exposes
 * a helper (getToken) to retrieve the current user's ID token.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - React children rendered inside the provider
 * @returns {JSX.Element} The provider element
 */
export function AuthProvider({ children }) {
  // local state for currently signed-in user & loading indicator
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ensure persistent session (localStorage)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch(() => {});
  }, []);

  // subscribe to Firebase auth state changes & keep local state in sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /**
   * Get the current user's ID token.
   *
   * Useful for authenticating requests to your backend. Returns null if no
   * user is signed in.
   *
   * @async
   * @function getToken
   * @returns {Promise<string|null>} A fresh ID token string, or null when not signed in
   */
  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await auth.currentUser.getIdToken();
  };

  // provide user, loading & getToken helper to consumers
  return (
    <AuthContext.Provider value={{ user, loading, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth hook
 *
 * Convenience hook to access authentication context values: user, loading, and getToken.
 *
 * @returns {{ user: import('firebase/auth').User|null, loading: boolean, getToken: () => Promise<string|null> }}
 */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
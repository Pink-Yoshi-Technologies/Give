import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Protects children by requiring an authenticated user.
 * While auth is loading it returns null (could show a spinner).
 */
const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default RequireAuth;

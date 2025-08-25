import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * RequireAuth module
 *
 * A route guard component that only renders its children when a user is authenticated.
 * While the authentication state is being determined this component returns null
 * (replace with a spinner or skeleton UI if desired). If no user is present it
 * redirects to the sign-in route.
 *
 * @module RequireAuth
 */

/**
 * RequireAuth wrapper
 *
 * @param {{ children: React.ReactNode }} props - The children to render when authenticated
 * @returns {JSX.Element|null} Children when authenticated, <Navigate/> to the sign-in page when not authenticated, or null while loading
 */
const RequireAuth = ({ children }) => {
  // obtain current user and loading state from AuthContext
  const { user, loading } = useAuth();

  // while auth initialization in progress, don't render anything
  if (loading) return null;

  // if no authenticated user, redirect to sign-in route
  if (!user) return <Navigate to="/" replace />;

  // user is authenticated: render wrapped children
  return children;
};

export default RequireAuth;

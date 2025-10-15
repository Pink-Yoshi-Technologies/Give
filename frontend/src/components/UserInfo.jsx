/**
 * UserInfo component displays the current user's profile information.
 *
 * @returns {JSX.Element} The rendered component.
 */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import logoutUser from '../auth/logout';

export default function UserInfo() {
  // Get the authenticated user from context
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  // Extract display name, username, and profile picture from user object
  // displayName: user's display name or fallback to 'User'
  const displayName = user?.displayName || 'User';
  // username: part before '@' in email, or UID if email is missing
  const username = user?.email ? user.email.split('@')[0] : (user?.uid || 'username');
  // profilePic: user's photoURL or fallback to default profile image
  const profilePic = user?.photoURL || '/images/noPfp.jpg';

  // Logout handler triggers Firebase sign out, clears storage, and redirects home
  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutUser();
    } finally {
      setLoggingOut(false);
      navigate('/');
    }
  };

  return (
    // Main container for user info
    <div className="w-full rounded-3xl flex items-start bg-backgroundGrey px-4 py-2 gap-2">
      {/* User Avatar */}
      <div className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden">
        <img
          src={profilePic}
          alt={`${displayName} profile`}
          className="w-full h-full object-cover"
        />
      </div>
      {/* User details and Edit Profile button */}
      <div className="flex flex-col items-start justify-between gap-2">
        <div className="text-left">
          {/* Greeting with display name */}
          <p className="text-xl font-semibold text-black">
            Hi {displayName}!
          </p>
          {/* Username display */}
          <p className="text-[0.6rem] text-black-200">
            @{username}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Edit Profile button (no functionality yet) */}
          <button className="text-[0.6rem] text-black-200">Edit Profile</button>
          {/* Logout button triggers auth cleanup and navigation */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="text-[0.6rem] text-red-500 hover:text-red-600 disabled:opacity-60 transition-colors"
          >
            {loggingOut ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { useAuth } from '../contexts/AuthContext';

export default function UserInfo() {
  const { user } = useAuth();

  // auth user provides displayName, email, photoURL, uid
  const displayName = user?.displayName || 'User';
  const username = user?.email ? user.email.split('@')[0] : (user?.uid || 'username');
  const profilePic = user?.photoURL || '/images/noPfp.jpg';

  return (
    <div className="w-full rounded-3xl flex items-start bg-backgroundGrey px-4 py-2 gap-2">
      {/* User Avatar */}
      <div className="w-14 h-14 rounded-full bg-gray-300 overflow-hidden">
        <img
          src={profilePic}
          alt={`${displayName} profile`}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex flex-col items-start justify-between gap-2">
        <div className="text-left">
          <p className="text-xl font-semibold text-black">
            Hi {displayName}!
          </p>
          <p className="text-[0.6rem] text-black-200">
            @{username}
          </p>
        </div>
        <div>
          <button className="text-[0.6rem] text-black-200">Edit Profile</button>
        </div>
      </div>
    </div>
  );
}
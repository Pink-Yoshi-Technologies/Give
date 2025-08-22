import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import { ReactComponent as NotificationIcon } from "../assets/notification.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings.svg";
import clsx from "clsx";

  const credibleResponses = [
    { label: "Group 1", url: "/groups&id=1" },
    { label: "Group 2", url: "/groups&id=2" },
    { label: "Group 3", url: "/groups&id=3" },
    { label: "Group 4", url: "/groups&id=4" },
    { label: "#nails", url: "/tags&id=nails" },
    { label: "#makeup", url: "/tags&id=makeup" },
    { label: "#dinner", url: "/tags&id=dinner" },
    { label: "#hair", url: "/tags&id=hair" },
  ];

function NavBar() {
  const { user } = useAuth();
  const displayName = user?.displayName || (user?.email ? user.email.split('@')[0] : 'User');
  const profilePic = user?.photoURL || 'https://placehold.co/600x400.png';
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const filtered = credibleResponses.filter((s) =>
      s.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredSuggestions(filtered);
    setShowDropdown(filtered.length > 0);
  }, [searchQuery]);

  // Close dropdown and clear input when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };


  return (
    <nav className="flex items-center relative h-[90px]">
      {/* Brand */}
      <div className="cursor-pointer w-[27%] flex justify-start">
      <h1 className="text-defaultYellow text-4xl font-bold font-header">
        Give
      </h1>
      </div>
      <div className="w-[46%] flex gap-4">
        <div className="w-full max-w-[500px]">
          <div>
          <form onSubmit={handleSearchSubmit} className="flex-1 relative" ref={dropdownRef}>
            <div className="relative flex items-center w-full py-1 pl-5 pr-2 rounded-full bg-darkGrey placeholder-black/40">
              <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search Groups, Tags, or Polls..."
              className="w-full text-base bg-darkGrey placeholder-black/40 outline-none"
              />
              {showDropdown && (
                <ul 
                    style={{ top: "2.7rem", borderColor: "#cacaca" }}
                    className="absolute left-0 right-0 text- base mt-1 bg-backgroundGrey border rounded-[1rem] shadow-md max-h-60 overflow-y-auto top:2rem z-50">
                  {filteredSuggestions.map((s, i) => (
                  <li key={i} className="px-3 py-2 text-left group">
                    <Link to={s.url} className="text-base text-gray-500 group-hover:text-black">
                      {s.label}
                    </Link>
                  </li>
                  ))}
                </ul>
              )}
              <button
                type="submit"
                className="right-2 p-2 rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-5 h-5 stroke-2 text-black opacity-60 hover:opacity-100"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </button>
          </div>
        </form>
      </div>
    </div>

      {/* Notification Button */}
      <button className="p-2.5 rounded-full flex items-center justify-center bg-darkGrey">
        <NotificationIcon className="w-6 h-6 stroke-2 text-gray-600" />
      </button>
      </div>
      {/* Group search bar + notification button */}
      
      <div className="flex items-center gap-4 w-[27%] justify-end">
        <div className="flex items-center gap-2 cursor-pointer rounded-[25px]">
          <div className={clsx("w-[45px] h-[45px] rounded-full border-2 border-darkGrey", { "bg-gray-300": !profilePic })}>
            <img
              src={profilePic}
              alt={`${displayName} Avatar`}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <span className="font-medium text-gray-700 text-lg">{displayName}</span>
        </div>

        <button className="rounded-full flex items-center justify-center">
          <SettingsIcon className="w-10 h-10" />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;

import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ReactComponent as NotificationIcon } from "../assets/notification.svg";
import { ReactComponent as SettingsIcon } from "../assets/settings.svg";
import clsx from "clsx";
import { searchAll } from "../services/Search";

/**
 * NavBar Component
 *
 * Provides navigation functionality including:
 * - Brand logo/title
 * - Search functionality with real-time suggestions
 * - Notifications button
 * - User profile display
 * - Settings Button
 */
function NavBar() {
  // Get current authenticated user from context
  const { user } = useAuth();

  // Extract display name from user data, fallback to email prefix or "User"
  const displayName =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "User");

  // Use user's profile picture or placeholder if not available
const profilePic =
    user?.uid === "NriIZ1wx4qXPRJfkXxOqS0dppHA2"
      ? "/images/profile.jpg"
      : user?.photoURL || '/images/noPfp.jpg';

  // State for search functionality
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Refs for dropdown management and debouncing
  const dropdownRef = useRef(null); // Reference to dropdown container for outside click detection
  const debounceRef = useRef(null); // Reference to debounce timer

  /**
   * Handle search form submission
   * Currently only manages dropdown, no navigation implemented
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Currently dropdown only; no navigation yet
  };

  /**
   * Effect for debounced search functionality
   * Triggers Firestore search after 250ms delay when user stops typing
   */
  useEffect(() => {
    // Clear existing timeout
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Hide dropdown and clear suggestions if no search query
    if (!searchQuery.trim()) {
      setFilteredSuggestions([]);
      setShowDropdown(false);
      return;
    }

    // Set debounced timeout for search
    debounceRef.current = setTimeout(async () => {
      try {
        //Perform search using external search service
        const res = await searchAll(searchQuery);

        // Process and format search results into suggestions
        const items = [
          // User suggestions - prefixed with @
          ...res.users.map((u) => ({
            label: `@${u.displayName || u.username || ""}`.trim(),
            type: "user",
          })),

          // Group suggestions - prefixed with "Group:"
          ...res.groups.map((g) => ({
            label: `Group: ${g.name || g.displayName || ""}`.trim(),
            type: "group",
            groupId: g.id || g.groupId || "",
          })),

          // Tag suggestions - prefixed with #
          ...res.posts.byTag.flatMap((p) => {
            const tags = Array.isArray(p.tags) ? p.tags : [];
            //Find matching tag or use first available tag
            const match =
              tags.find((t) =>
                (t || "")
                  .toLowerCase()
                  .includes(searchQuery.trim().toLowerCase().replace(/^#/, ""))
              ) ||
              tags[0] ||
              "";
            return match
              ? [{ label: `#${match.replace(/^#/, "")}`, type: "tag" }]
              : [];
          }),

          // Author suggestions - prefixed with "Author:"
          ...res.posts.byAuthor.map((p) => ({
            label: `Author: ${p.authorDisplayName || ""}`.trim(),
            type: "post_author",
          })),

          // Content suggestions - truncated post content
          ...res.posts.byContent.map((p) => ({
            label: `${(p.content || "").slice(0, 60)}${
              (p.content || "").length > 60 ? "…" : ""
            }`,
            type: "post_content",
          })),
        ]
          //Remove duplicates and empty labels, limit to 12 items
          .filter(
            (it, idx, arr) =>
              it.label && arr.findIndex((x) => x.label === it.label) === idx
          )
          .slice(0, 12);

        // Update suggestions and show dropdown if results exist
        setFilteredSuggestions(items);
        setShowDropdown(items.length > 0);
      } catch (err) {
        console.error("[NavBar] search error", err);
        setFilteredSuggestions([]);
        setShowDropdown(false);
      }
    }, 250); // 250ms debounce delay

    // CLeanup timeout on dependency change or unmount
    return () => clearTimeout(debounceRef.current);
  }, [searchQuery]);

  /**
   * Effect to handle clicking outside the dropdown
   * Closes dropdown and clears search when clicking elsewhere
   */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
        setSearchQuery("");
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center relative h-[90px]">
      {/* Brand Section - Left aligned logo/title */}
      <div className="cursor-pointer w-[27%] flex justify-start">
        <h1 className="text-defaultYellow text-4xl font-bold font-header">
          Give
        </h1>
      </div>

      {/* Center Section - Search bar and notifications */}
      <div className="w-[46%] flex gap-4">
        <div className="w-full max-w-[500px]">
          {/* Search Container */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 relative"
            ref={dropdownRef}
          >
            {/* Search Input with Dropdown */}
            <div className="relative flex items-center w-full py-1 pl-5 pr-2 rounded-full bg-darkGrey placeholder-black/40">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search @users, Groups, #tags, or Posts…"
                className="w-full text-base bg-darkGrey placeholder-black/40 outline-none"
              />
              {/* Search Suggestions Dropdown */}
              {showDropdown && (
                <ul
                  style={{ top: "2.7rem", borderColor: "#cacaca" }}
                  className="absolute left-0 right-0 text-base mt-1 bg-backgroundGrey border rounded-[1rem] shadow-md max-h-60 overflow-y-auto z-50"
                >
                  {filteredSuggestions.map((s, i) => {
                    // SPecial handling for group suggestions with navigation
                    if (s.type === "group" && s.groupId) {
                      return (
                        <li
                          key={i}
                          className="px-3 py-2 text-left group hover:bg-gray-100 cursor-pointer"
                        >
                          <Link
                            to={`/group/${s.groupId}`}
                            className="text-base text-gray-600 group-hover:text-black w-full block"
                          >
                            {s.label}
                          </Link>
                        </li>
                      );
                    }
                    //Default suggestion item (no navigation yet)
                    return (
                      <li
                        key={i}
                        className="px-3 py-2 text-left group hover:bg-gray-100 cursor-pointer"
                      >
                        <span className="text-base text-gray-600 group-hover:text-black">
                          {s.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {/* Search Submit Button */}
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

        {/* Notifications Button */}
        <button className="p-2.5 rounded-full flex items-center justify-center bg-darkGrey">
          <NotificationIcon className="w-6 h-6 stroke-2 text-gray-600" />
        </button>
      </div>

      {/* Right Section - User profile and settings */}
      <div className="flex items-center gap-4 w-[27%] justify-end">
        {/* User Profile Display */}
        <div className="flex items-center gap-2 cursor-pointer rounded-[25px]">
          {/* Profile Picture */}
          <div
            className={clsx(
              "w-[45px] h-[45px] rounded-full border-2 border-darkGrey",
              { "bg-gray-300": !user?.photoURL } // Gray background if no photo
            )}
          >
            <img
              src={profilePic}
              alt={`${displayName} Avatar`}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* User Display Name */}
          <span className="font-medium text-gray-700 text-lg">
            {displayName}
          </span>
        </div>

        {/* Settings Button */}
        <button className="rounded-full flex items-center justify-center">
          <SettingsIcon className="w-10 h-10" />
        </button>
      </div>
    </nav>
  );
}

export default NavBar;

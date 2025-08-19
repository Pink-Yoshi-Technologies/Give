import React, { useState, useRef, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, getFirestore, query, where } from "firebase/firestore";
import { auth } from "../firebase";
import clsx from "clsx";

export default function GroupSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  // Fetch user's groups from Firestore
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  useEffect(() => {
    let unsubscribe;
    setLoadingGroups(true);
    unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const db = getFirestore();
        // Query groups where users array contains the current user's UID
        const q = query(collection(db, "groups"), where("users", "array-contains", user.uid));
        const groupSnap = await getDocs(q);
        const userGroups = groupSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGroups(userGroups);
      } else {
        setGroups([]);
      }
      setLoadingGroups(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const filteredGroups = groups.filter((group) =>
    group.name && group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown and clear input when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
        setSearchQuery("");
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function GroupItem({ group }) {
    const { id, name, profilePic } = group;
    return (
      <li className="flex items-center rounded-xl gap-4 p-2 cursor-pointer group">
        <div className={clsx("w-10 h-10 rounded-full overflow-hidden", { "bg-gray-300": !profilePic })}>
          <img
            src={`images/${profilePic}` ?? "/images/placeholder.svg"}
            alt={`${name} profile`}
            className="w-full h-full object-cover"
          />
        </div>
        <a
          href={`/group&id=${id}`}
          className="font-semibold text-base text-black group-hover:text-black/40"
        >
          {name}
        </a>
      </li>
    );
  }
  
  const displayedGroups =
    searchQuery.trim()
      ? filteredGroups
      : expanded
      ? groups
      : groups.slice(0, 5);

  return (
    <div className="w-full h-full relative">
      <div className={`bg-backgroundGrey rounded-3xl p-4 shadow-sm flex flex-col gap-4 ${expanded ? 'h-full' : ''}`}>
        <div>
          <p className="font-semibold text-base text-black text-left">Groups</p>
        </div>

        <div className="flex gap-4">
          <div className="w-full max-w-[500px]" ref={inputRef}>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <div className="relative flex items-center w-full py-1 pl-5 pr-2 rounded-full bg-darkGrey placeholder-black/40 h-8">
                <input
                  type="text"
                  placeholder="Search Groups"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full text-xs bg-darkGrey placeholder-black/40 outline-none"
                />
                <button
                  type="submit"
                  className="right-2 p-2 rounded-full flex items-center justify-center"
                >
                  <svg
                    className="w-4 h-4 stroke-2 text-black opacity-60 hover:opacity-100"
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
        {/* List of Groups */}
        <div className={`flex flex-col gap-2 ${expanded ? "overflow-y-auto" : ""} with-scrollbar items-start`}>
          <ul className='flex flex-col gap-2 grow'>
            {loadingGroups ? (
              <li className="text-gray-500 text-sm">Loading groups...</li>
            ) : displayedGroups.length === 0 ? (
              <li className="text-gray-500 text-sm">No groups found.</li>
            ) : (
              displayedGroups.map((group) => (
                <GroupItem key={group.id} group={group} />
              ))
            )}
          </ul>
          {filteredGroups.length > 5 && !searchQuery.trim() && (
            <button
              type="button"
              className="right-2 p-2 rounded-full flex items-center justify-center "
              onClick={() => setExpanded((prev) => !prev)}
            >
              <p className="text-xs font-semibold text-black opacity-60 hover:opacity-100">
                {expanded ? "Collapse" : "View All"}
              </p>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
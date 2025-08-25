/**
 * Group tab component.
 */
import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Group tab component.
 * @param {Object} param0 - The component props.
 * @param {string} param0.id - The ID of the group.
 * @returns {JSX.Element}
 */
export default function GroupTab({ id, accessible }) {
  const [showMembers, setShowMembers] = useState(false);
  const [group, setGroup] = useState(null);
  const [memberNames, setMemberNames] = useState([]);
  const [mostUsedTags, setMostUsedTags] = useState([]);

  /**
   * Fetch group information, member names, and most used tags.
   */
  useEffect(() => {
    async function fetchGroupAndMembersAndTags() {
      // Fetch group document
  if (!id) return;
  const groupRef = doc(db, "groups", id);
  const groupSnap = await getDoc(groupRef);
  if (groupSnap.exists()) {
        const groupData = groupSnap.data();
        setGroup(groupData);
        // Fetch user displayNames for each user ID in groupData.users
        let memberIds = Array.isArray(groupData.users) ? groupData.users : [];
        if (memberIds.length > 0) {
          const userDisplayNames = await Promise.all(
            memberIds.map(async (userId) => {
              const userRef = doc(db, "users", userId);
              const userSnap = await getDoc(userRef);
              if (userSnap.exists()) {
                return userSnap.data().displayName || userId;
              }
              return userId;
            })
          );
          setMemberNames(userDisplayNames);
          // Fetch posts by these users
          const postsRef = collection(db, "posts");
          let allPosts = [];
          for (let i = 0; i < memberIds.length; i += 10) {
            const batchIds = memberIds.slice(i, i + 10);
            const postsQ = query(postsRef, where("authorId", "in", batchIds));
            const postsSnap = await getDocs(postsQ);
            allPosts = allPosts.concat(postsSnap.docs.map((d) => d.data()));
          }
          // Collect all tags
          let tagCounts = {};
          allPosts.forEach(post => {
            let tags = Array.isArray(post.tags) ? post.tags : (post.tags ? [post.tags] : []);
            tags.forEach(tag => {
              tagCounts[tag] = (tagCounts[tag] || 0) + 1;
            });
          });
          // Sort tags by frequency
          const sortedTags = Object.entries(tagCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([tag]) => tag)
            .slice(0, 3);
          setMostUsedTags(sortedTags);
        } else {
          setMemberNames([]);
          setMostUsedTags([]);
        }
      }
    }
    fetchGroupAndMembersAndTags();
  }, [id]);

  return (
  <div className="w-full rounded-xl h-full">
    <div className={`bg-backgroundGrey rounded-3xl p-3 flex flex-col ${showMembers ? 'h-full' : ''}`}>
      {/* Group Header */}
      <div className="flex items-center p-4 rounded-xl bg-defaultYellow gap-3">
        <div
          className={clsx(
            "w-10 h-10 rounded-full overflow-hidden border-2 border-white",
                { "bg-gray-300": !group?.name }
          )}
        >
              <img
                src={group?.name ? `/images/${group.name}.jpg` : "/images/placeholder.svg"}
                alt={`${group?.name || `Group ${id}`} profile`}
                className="w-full h-full object-cover"
                onError={e => { e.target.onerror = null; e.target.src = "/images/placeholder.svg"; }}
              />
        </div>
        <div className="flex flex-col items-start">
          <p className="font-semibold text-base text-black">{group?.name || `Group ${id}`}</p>
          <span className="text-xs text-black-600 mt-1">{memberNames.filter(Boolean).length} members</span>
        </div>
        {!accessible && (
          <div>
            <img
              src="/lock.svg"
              alt="lock"
              style={{ width: "1.5em", height: "1.5em", marginLeft: "1.5rem" }}
            />
          </div>
        )}
      </div>

      {/* Most Used Tags */}
      <div className="mt-5">
        <h3 className={`text-sm font-semibold text-left ${accessible ? "text-black" : "text-black/40"}`}>
          Most Used Tags
        </h3>
        <ul className="text-xs font-semibold mt-2 leading-6 font-medium text-black">
          {mostUsedTags.length === 0 ? (
            <li className={`pl-2 ${!accessible ? "text-black/40" : ""}`}>No tags found</li>
          ) : (
            mostUsedTags.map((tag) => (
              <li key={tag} className="flex justify-between items-center cursor-pointer pl-2">
                {tag}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* View Members */}
      <div className="mt-5 with-scrollbar overflow-y-auto flex-1">
        <button
          className={`flex justify-between w-full font-semibold text-sm ${
            accessible ? "text-black" : "text-black/40 cursor-default"
          }`}
          onClick={() => { if (accessible) setShowMembers(!showMembers); }}
          disabled={!accessible}
        >
          View Members
          <span>
            <img
              src="/arrow.svg"
              alt={showMembers ? "arrow up" : "arrow down"}
              style={{
                width: "0.75em",
                height: "0.75em",
                transform: showMembers ? "rotate(-90deg)" : "rotate(90deg)",
                opacity: accessible ? 1 : 0.4,
              }}
            />
          </span>
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            showMembers ? "opacity-100" : "max-h-0 opacity-0 hidden with-scrollbar"
          }`}
          style={showMembers ? { maxHeight: `${memberNames.length * 40}px` } : { maxHeight: 0 }}
        >
          <ul className="mt-3 space-y-2">
            {memberNames.map((displayName, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                  alt="avatar"
                  className="w-5 h-5"
                />
                {displayName}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);
}
// Group page displays information about a specific group.
// Handles group access, member list, and restricted view logic.
// Uses GroupTab, JoinGroup, and other components for layout and functionality.
import React, { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import PostsList from "../components/PostsList";
import { GroupTab, GroupSearch, CreatePost, JoinGroup } from "../";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import { usePosts } from "../hooks/UsePosts";
import { groupTabConfig } from "../config/tabConfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Group component displays the group page with posts and group information.
 *
 * @returns {JSX.Element} The rendered component.
 */
export default function Group() {
  const { groupId: id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { posts, loading: postsLoading } = usePosts();

  const [accessible, setAccessible] = useState(false);
  const [loadingGroup, setLoadingGroup] = useState(true);
  const [groupName, setGroupName] = useState("");

  const currentTab = "group";
  const handleTabChange = () => {};

  useEffect(() => {
    async function checkMembershipAndFetchName() {
      if (!id || !user) return;
      try {
        const groupRef = doc(db, "groups", id);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
          const groupData = groupSnap.data();
          const usersArray = Array.isArray(groupData.users) ? groupData.users : [];
          // Use user.uid (Firebase Auth)
          const isMember = usersArray.includes(user.uid);
          setAccessible(isMember);
          setGroupName(groupData.name || "");
        } else {
          setAccessible(false);
          setGroupName("");
        }
      } catch (err) {
        console.error("Error fetching group:", err);
        setAccessible(false);
        setGroupName("");
      } finally {
        setLoadingGroup(false);
      }
    }
    checkMembershipAndFetchName();
  }, [id, user]);

  if (authLoading || loadingGroup) return null;
  if (!user) return <Navigate to="/" replace />;

  // Inject group name into each post for consistency
  const postsWithGroup = accessible
    ? posts.map((p) => ({
        ...p,
        group: { name: groupName },
      }))
    : [];

  return (
    <AppLayout
      left={
        <LeftSidebar
          screenTabProps={{
            tabConfig: groupTabConfig,
            onTabChange: handleTabChange,
            onCurrentTab: currentTab,
          }}
          extra={
            <div className="flex-1 overflow-y-hidden">
              <GroupTab id={id} accessible={accessible} />
            </div>
          }
        />
      }
      center={
        accessible ? <PostsList posts={postsWithGroup} /> : <JoinGroup id={id} />
      }
      right={<GroupSearch />}
    />
  );
}

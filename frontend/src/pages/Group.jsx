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

  const currentTab = "group";
  const handleTabChange = () => {};

  useEffect(() => {
  async function checkMembership() {
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
      } else {
        setAccessible(false);
      }
    } catch (err) {
      console.error("Error fetching group:", err);
      setAccessible(false);
    } finally {
      setLoadingGroup(false);
    }
  }
  checkMembership();
}, [id, user]);

  if (authLoading || loadingGroup) return null;
  if (!user) return <Navigate to="/" replace />;

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
        <div className="flex-1 overflow-y-auto">
          {accessible ? <PostsList posts={posts} /> : <JoinGroup id={id} />}
        </div>
      }
      right={<GroupSearch />}
    />
  );
}

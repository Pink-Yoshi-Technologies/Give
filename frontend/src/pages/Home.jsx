/**
 * Home page component.
 */
import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import PostsList from "../components/PostsList";
import { SuggestedBox, GroupSearch, CreatePost } from "../";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { usePosts } from "../hooks/UsePosts";
import { homeTabConfig } from "../config/tabConfig";

/**
 * Home page component.
 * @returns {JSX.Element}
 */
export default function HomeScreen() {
  const { user } = useAuth();
  const { posts, loading } = usePosts();
  const [currentTab, setCurrentTab] = useState("home");

  const showCreate = currentTab === "create";

  return (
    <AppLayout
      left={
        <LeftSidebar
          screenTabProps={{
            tabConfig: homeTabConfig,
            onTabChange: setCurrentTab,
            onCurrentTab: currentTab,
          }}
          extra={<SuggestedBox />}
        />
      }
      center={
        showCreate ? <CreatePost /> : loading ? null : <PostsList posts={posts} />
      }
      right={<GroupSearch />}
    />
  );
}
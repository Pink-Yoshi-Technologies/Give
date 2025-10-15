/**
 * Home page component.
 */
import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import PostsContainer from "../components/PostsContainer";
import { SuggestedBox, GroupSearch, CreatePost, CreateGroup } from "../";
import { homeTabConfig } from "../config/tabConfig";

/**
 * Home page component.
 * @returns {JSX.Element}
 */
export default function HomeScreen() {
  const [currentTab, setCurrentTab] = useState("home");

    const showCreate = currentTab === "create";

    const showCreateGroup = currentTab === "createGroup";

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
          showCreate ? <CreatePost /> : <PostsContainer />
      }
      right={
        showCreateGroup ? <CreateGroup /> : <GroupSearch />
      }
    />
  );
}
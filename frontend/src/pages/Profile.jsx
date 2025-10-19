/**
 * Home page component.
 */
import React, { useState } from "react";
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import { SuggestedBox, GroupSearch, CreatePost, CreateGroup, Profile } from "..";
import { profileTabConfig } from "../config/tabConfig";
import RequireAuth from '../components/RequireAuth';

/**
 * Home page component.
 * @returns {JSX.Element}
 */
export default function ProfileScreen() {
    const [currentTab, setCurrentTab] = useState("profile");

    // Directly rendering the appropriate component based on currentTab
    const renderCenterComponent = () => {
        switch (currentTab) {
            case "create":
                return <CreatePost />;
            case "createGroup":
                return <CreateGroup />;
            case "profile":
            default:
                return <RequireAuth><Profile /></RequireAuth>;
        }
    };

    return (
        <AppLayout
            left={
                <LeftSidebar
                    screenTabProps={{
                        tabConfig: profileTabConfig,
                        onTabChange: setCurrentTab,
                        onCurrentTab: currentTab,
                    }}
                    extra={<SuggestedBox />}
                />
            }
            center={renderCenterComponent()}
            right={<GroupSearch />}
        />
    );
}

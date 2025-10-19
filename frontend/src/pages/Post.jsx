/**
 * Post page component.
 */
import AppLayout from "../layouts/AppLayout";
import LeftSidebar from "../components/LeftSideBar";
import { SuggestedBox, GroupSearch, PostContainer } from "../";
import { postTabConfig } from "../config/tabConfig";
import { useParams } from "react-router-dom";

/**
 * Post page component.
 * @returns {JSX.Element}
 */
export default function Post() {
    const { postId: pId } = useParams();
    const currentTab = "post";
    const handleTabChange = () => { };

    return (
        <AppLayout
            left={
                <LeftSidebar
                    screenTabProps={{
                        tabConfig: postTabConfig,
                        onTabChange: handleTabChange,
                        onCurrentTab: currentTab,
                    }}
                    extra={<SuggestedBox />}
                />
            }
            center={
                <PostContainer postId={pId} />
            }
            right={
                <GroupSearch />
            }
        />
    );
}
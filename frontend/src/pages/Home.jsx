
import React from "react";
import {
  Post,
  SuggestedBox,
  UserInfo,
  NavBar,
  ScreenTab,
  GroupSearch,
  CreatePost,
} from "../";

import { useState, useMemo } from "react";
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';


function HomeScreen({ postData }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTab, setCurrentTab] = useState("home");
  const [activeTab, setActiveTab] = useState("home");

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search for:", searchQuery);
    // TODO: route to results page or trigger fetch here
  };
// ...existing code...
const posts = [
  postData && postData.post ? { ...postData } : null,
  postData && postData.post
    ? { ...postData, post: { ...postData.post, id: "p2", question: "Favourite movie snack?" } }
    : null,
  postData && postData.post
    ? { ...postData, post: { ...postData.post, id: "p3", question: "Dinner plans tonight?" } }
    : null,
].filter(Boolean); // removes any nulls

  return (
    <div className="font-sans">
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="shrink-0">
          <NavBar />
        </header>

        {/* min-h-0 lets children shrink and scroll correctly */}
        <main className="flex flex-1 min-h-0">
          {/* left column */}
          <aside className="flex w-[27%] flex-col gap-4 sticky top-0 max-h-screen overflow-y-auto flex-shrink-0">
            <UserInfo />
            <ScreenTab onTabChange={setActiveTab} activeTab={activeTab} />
            <SuggestedBox />
          </aside>

          {/* center column — remove h-screen, make it the scroller */}
          <section className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide px-2">
            {currentTab === "create" ? (
              <CreatePost/>
            ) : (
              postData &&
              postData.map((p) => (
                <Post
                  key={p.id}
                  user={{
                    id: p.authorId ?? undefined,
                    name: p.authorDisplayName || "unknown",
                    profilePic: p.authorPhotoURL || undefined,
                  }}
                  group={p.group || undefined}
                  post={p}
                  // pollOptions={p.polls ?? []}
                />
              ))
            )}
            {currentTab === "home" && (
// ...existing code...
<section className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide px-2">
  {posts.map((post) => (
    <Post
      key={post.post.id}
      user={post.user}
      group={post.group}
      post={post.post}
      // pollOptions={post.pollOptions}
    />
  ))}
</section>
            )}
          </section>

          {/* right column */}
          <aside className="flex w-[27%] flex-col sticky top-0 max-h-screen flex-shrink-0 scrollbar-groupSearch">
            <GroupSearch />
          </aside>
        </main>
      </div>
    </div>
  );
}

export default HomeScreen;

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchPostsByTag } from "../services/Search";
import LeftSidebar from "../components/LeftSideBar";
import PostsList from "../components/PostsList";
import { PostsRefreshProvider } from "../components/PostsContainer";
import { SuggestedBox, GroupSearch, NavBar, UserInfo, ScreenTab } from "../";
import { homeTabConfig, exploreTabConfig } from "../config/tabConfig";
import { getPostData } from "../hooks/UsePosts";

/**
 * Explore page component.
 * @returns {JSX.Element}
 */
export default function Explore() {
  const [searchParams] = useSearchParams();
  const tag = searchParams.get("tag");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch posts when tag changes
  useEffect(() => {
    let active = true;
    async function loadPosts() {
      try {
        setLoading(true);
        setError("");
        let postData = [];
        if (tag) {
          // Filter by tag
          postData = await fetchPostsByTag(tag);
        } else {
          // No tag provided: behave like home (latest posts)
          postData = await getPostData({ limitCount: 30, orderByField: "createdAt", orderDirection: "desc" });
        }
        if (!active) return;
        setPosts(postData);
      } catch (err) {
        if (!active) return;
        console.error("[Explore] Failed to load posts:", err);
        setError(err.message || "Failed to load posts");
      } finally {
        if (active) setLoading(false);
      }
    }
    loadPosts();
    return () => {
      active = false;
    };
  }, [tag]);

  // Expose a simple refresh function for poll updates
  const refreshPosts = async () => {
    try {
      let postData = [];
      if (tag) {
        postData = await fetchPostsByTag(tag);
      } else {
        postData = await getPostData({ limitCount: 30, orderByField: "createdAt", orderDirection: "desc" });
      }
      setPosts(postData);
    } catch (e) {
      console.warn("[Explore] refreshPosts failed", e);
    }
  };

  // Split posts evenly across three columns (by count)
  const [col1, col2, col3] = useMemo(() => {
    const cols = [[], [], []];
    posts.forEach((p, i) => cols[i % 3].push(p));
    return cols;
  }, [posts]);

  return (
    <PostsRefreshProvider value={{ refreshPosts }}>
      <div className="font-sans">
        <div className="h-screen flex flex-col overflow-hidden">
          <header className="shrink-0">
            <NavBar />
          </header>
          <main className="flex flex-1 min-h-0 overflow-y-auto">
            <div className="flex flex-col flex-1 min-w-0 px-2 w-full max-w-5xl mx-auto">
              <div className="mb-6 flex flex-col md:flex-row gap-6 items-start w-full">
                <div className="flex-1 min-w-0">
                  <UserInfo />
                  <div className="mt-4">
                    <ScreenTab tabConfig={exploreTabConfig} onTabChange={() => {}} onCurrentTab="explore" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
                  <h2 className="text-2xl font-bold text-gray-800 text-center">
                    {tag ? `#${tag}` : "Explore"}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1 text-center">
                    {tag ? `Posts tagged with #${tag}` : "Latest posts"}
                  </p>
                </div>
                <div className="flex-1 min-w-0">
                  <SuggestedBox />
                </div>
              </div>
              {loading && (
                <div className="p-6 text-center text-gray-600">Loading posts...</div>
              )}
              {error && (
                <div className="p-6 text-center text-red-600">{error}</div>
              )}
              {!loading && !error && posts.length === 0 && (
                <div className="p-6 text-center text-gray-600">
                  No posts found {tag ? `with #${tag}` : ""}
                </div>
              )}
              {!loading && !error && posts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div className="flex flex-col gap-4">
                    <PostsList posts={col1} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <PostsList posts={col2} />
                  </div>
                  <div className="flex flex-col gap-4">
                    <PostsList posts={col3} />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </PostsRefreshProvider>
  );
}

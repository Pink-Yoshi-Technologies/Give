import React, { createContext, useContext } from "react";
import { usePosts, usePost } from "../hooks/UsePosts";
import PostsList from "./PostsList";

// Create context only for posts refresh functionality
const PostsRefreshContext = createContext();

// Exportable provider so other pages (e.g., Explore) can supply a refresh
// function and allow components like PollBox to call usePostsRefresh safely
export function PostsRefreshProvider({ value, children }) {
  return (
    <PostsRefreshContext.Provider value={value}>
      {children}
    </PostsRefreshContext.Provider>
  );
}

/**
 * Custom hook to access posts refresh functionality
 * Only available within PostsContainer
 */
export const usePostsRefresh = () => {
  const context = useContext(PostsRefreshContext);
  if (!context) {
    throw new Error("usePostsRefresh must be used within PostsContainer");
  }
  return context;
};

/**
 * PostsContainer Component
 * 
 * Encapsulates posts data management and provides refresh functionality
 * to child components without prop drilling. Only wraps the posts-related
 * components, not the entire app.
 */
export default function PostsContainer(groupId = "default") {
    var gId = "default";
    if (groupId !== "default") {
        const { groupId: id } = groupId;
        gId = id;
    }
    const { posts, loading, refreshPosts } = usePosts(gId);

    if (loading) return (
        <div className="w-full mx-auto">
            <div className="bg-backgroundGrey p-4 rounded-3xl shadow-md">
                <p className="text-gray-500 text-sm">Loading posts...</p>
            </div>
        </div>);

  return (
    <PostsRefreshContext.Provider value={{ refreshPosts }}>
      <PostsList posts={posts} />
    </PostsRefreshContext.Provider>
  );
}

/**
 * PostContainer Component
 * 
 * Encapsulates post data management and provides refresh functionality
 * to child components without prop drilling. Only wraps the posts-related
 * components, not the entire app.
 * Used for displaying singular post when accessed from profile page
 */
export function PostContainer(postId) {
    const { postId: id } = postId;
    const { posts, loading, refreshPosts } = usePost(id);

    if (loading) return (
        <div className="w-full mx-auto">
            <div className="bg-backgroundGrey p-4 rounded-3xl shadow-md">
                <p className="text-gray-500 text-sm">Loading post...</p>
            </div>
        </div>);

    return (
        <PostsRefreshContext.Provider value={{ refreshPosts }}>
            <PostsList posts={posts} />
        </PostsRefreshContext.Provider>
    );
}
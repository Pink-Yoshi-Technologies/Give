import React, { createContext, useContext } from "react";
import { usePosts } from "../hooks/UsePosts";
import PostsList from "./PostsList";

// Create context only for posts refresh functionality
const PostsRefreshContext = createContext();

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

  if (loading) return null;

  return (
    <PostsRefreshContext.Provider value={{ refreshPosts }}>
      <PostsList posts={posts} />
    </PostsRefreshContext.Provider>
  );
}
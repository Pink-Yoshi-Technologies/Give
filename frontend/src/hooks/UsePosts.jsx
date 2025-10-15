import { useEffect, useState } from "react";

export async function getPostData({
  limitCount = 10,
  orderByField = "createdAt",
    orderDirection = "desc",
    groupId = "default",
} = {}) {
  const params = new URLSearchParams({ limitCount, orderByField, orderDirection, groupId });
  const res = await fetch(`/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch");
  return res.json();
}

export function usePosts(groupId = "default") {
  const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const obj = {
        limitCount: 10,
        orderByField: "createdAt",
        orderDirection: "desc",
        groupId: groupId
    };

  const fetchPosts = async () => {
    try {
      const data = await getPostData(obj);
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const refreshPosts = async () => {
    await fetchPosts();
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getPostData(obj);
        if (alive) setPosts(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { posts, loading, refreshPosts };
}
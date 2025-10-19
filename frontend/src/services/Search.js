/**
 * Search service for querying users, groups, and posts.
 */
import { collection, getDocs, limit, query } from "firebase/firestore";
import { where, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const DEBUG = true;
const log = (...a) => DEBUG && console.log("[search]", ...a);
const warn = (...a) => DEBUG && console.warn("[search]", ...a);
const group = (label) => DEBUG && console.groupCollapsed(label);
const groupEnd = () => DEBUG && console.groupEnd();

/**
 * Fetch posts by tag.
 * Performs a Firestore query for posts whose `tags` array contains the given tag.
 * 
 * @param {string} tag - The tag to search for (case-insensitive).
 * @param {number} [max=20] - The maximum number of posts to return.
 * @returns {Promise<Array>} A promise resolving to an array of post objects.
 */
export async function fetchPostsByTag(tag, max = 20) {
  if (!tag) return [];

  const normalizedTag = tag.trim().toLowerCase();
  const postsRef = collection(db, "posts");

  try {
    // If you store tags as lowercase in Firestore:
    const q = query(
      postsRef,
      where("tags", "array-contains", normalizedTag),
      orderBy("createdAt", "desc"),
      limit(max)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  } catch (e) {
    console.warn("fetchPostsByTag failed:", e);
    return [];
  }
}

/**
 * Normalizes a search string by trimming and lowercasing it.
 * @param {*} s - The input string to normalize.
 * @returns {string} The normalized string.
 */
const norm = (s) => (s || "").toString().trim().toLowerCase();

/**
 * Converts a value to lowercase.
 * @param {*} v - The value to convert.
 * @returns {string} The lowercase string or an empty string.
 */
const lower = (v) => (typeof v === "string" ? v.toLowerCase() : "");

/**
 * Converts a value to an array.
 * @param {*} v - The value to convert.
 * @returns {Array} The array representation of the value.
 */
const asArray = (v) => {
  if (Array.isArray(v)) {
    return v;
  } else if (typeof v === "string") {
    return [v];
  } else {
    return [];
  }
};

/**
 * Searches for users based on a search term.
 * @param {string} term - The search term.
 * @param {number} max - The maximum number of results to return.
 * @returns {Promise<Array>} A promise that resolves to an array of user objects.
 */
export async function searchUsers(term, max = 8) {
  const needle = norm(term).replace(/^@/, "");
  if (!needle) return [];
  group(`users: "${term}"`);
  const qRef = query(collection(db, "users"), limit(30));
  const snap = await getDocs(qRef);
  const all = snap.docs.map((d) => ({ id: d.id, type: "user", ...d.data() }));
  const filtered = all.filter((u) => {
    const dn = lower(u.displayName); 
    const fn = lower(u.firstName);
    const ln = lower(u.lastName);
    const un = lower(u.username);
    const em = (u.email || "").toString().toLowerCase().split("@")[0] || "";
    return [dn, fn, ln, un, em].some((v) => v.includes(needle));
  });
  log("users filtered:", filtered.length);
  groupEnd();
  return filtered.slice(0, max);
}

/**
 * Searches for groups based on a search term.
 * @param {string} term - The search term.
 * @param {number} max - The maximum number of results to return.
 * @returns {Promise<Array>} A promise that resolves to an array of group objects.
 */
export async function searchGroups(term, max = 8) {
  const needle = norm(term).replace(/^@/, "");
  if (!needle) return [];
  group(`groups: "${term}"`);
  try {
    const qRef = query(collection(db, "groups"), limit(30));
    const snap = await getDocs(qRef);
    const all = snap.docs.map((d) => ({ id: d.id, type: "group", ...d.data() }));
    const filtered = all.filter((g) => lower(g.name).includes(needle));
    log("groups filtered:", filtered.length);
    groupEnd();
    return filtered.slice(0, max);
  } catch (e) {
    warn("groups failed:", e.message);
    groupEnd();
    return [];
  }
}

/**
 * Searches for posts based on a search term.
 * @param {string} term - The search term.
 * @param {number} maxPerBucket - The maximum number of results to return per bucket.
 * @returns {Promise<Object>} A promise that resolves to an object containing arrays of post objects.
 */
export async function searchPosts(term, maxPerBucket = 6) {
  const needle = norm(term);
  const tagNeedle = needle.replace(/^#/, "");
  group(`posts: "${term}"`);

  let byTag = [];
  let byContent = [];
  let byAuthor = [];

  // fetch once for content/author
  const contentQ = query(collection(db, "posts"), limit(30));
  const snap = await getDocs(contentQ);
  const allPosts = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Tags (case-insensitive, substring; tags can be string or array)
  if (tagNeedle) {
    byTag = allPosts
      .map((p) => ({ id: p.id, type: "post_tag", ...p }))
      .filter((p) => {
        const tags = asArray(p.tags).map((t) => lower(t));
        return tags.some((t) => t.includes(tagNeedle));
      });
    log("tag hits:", byTag.length);
  }

  // Content (defensive: only use strings)
  byContent = allPosts
    .map((p) => ({ id: p.id, type: "post_content", ...p }))
    .filter((p) => lower(p.content).includes(needle) || lower(p.title).includes(needle));
  log("content hits:", byContent.length);

  // Author (defensive)
  byAuthor = allPosts
    .map((p) => ({ id: p.id, type: "post_author", ...p }))
    .filter((p) => lower(p.authorDisplayName).includes(needle));
  log("author hits:", byAuthor.length);

  groupEnd();
  return {
    byTag: byTag.slice(0, maxPerBucket),
    byContent: byContent.slice(0, maxPerBucket),
    byAuthor: byAuthor.slice(0, maxPerBucket),
  };
}

/**
 * Searches for all types of content (users, groups, posts) based on a search term.
 * @param {string} term - The search term.
 * @returns {Promise<Object>} A promise that resolves to an object containing arrays of user, group, and post objects.
 */
export async function searchAll(term) {
  group(`searchAll "${term}"`);
  const [users, groups, posts] = await Promise.all([
    searchUsers(term),
    searchGroups(term),
    searchPosts(term),
  ]);
  log("aggregate:", {
    users: users.length,
    groups: groups.length,
    tag: posts.byTag.length,
    content: posts.byContent.length,
    author: posts.byAuthor.length,
  });
  groupEnd();
  return { users, groups, posts };
}

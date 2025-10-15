import React, { useEffect, useState, useRef } from "react";
import "../styles/index.css";
import imageIcon from "../assets/imageIcon.svg";
import { uploadManyAndGetUrls } from "../lib/StorageUpload";
import { useAuth } from "../contexts/AuthContext";
import PostData from "./PostData";
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore";

/**
 * Creates a new post via the backend API.
 *
 * @param {Object} params - Parameters for creating the post.
 * @param {Object} params.currentUser - The current user object (must have uid, displayName, photoURL).
 * @param {string} params.content - The text content of the post.
 * @param {string[]} [params.mediaUrls=[]] - Array of image/media URLs to attach to the post.
 * @param {string[]} [params.tags=[]] - Array of tags for the post.
 * @param {Array} [params.polls=[]] - Array of poll option objects for the post.
 * @returns {Promise<Object>} Resolves to the created post object.
 * @throws {Error} If the request fails or the server returns an error.
 */
export async function createPostViaApi({
  currentUser,
  content,
  mediaUrls = [],
  tags = [],
    polls = [],
  group,
}) {
    if (group === "None") {
        group = null;
    }
  // Construct request body with user info and post data
  const body = {
    content,
    mediaUrls,
    tags,
    authorId: currentUser?.uid ?? null,
    authorDisplayName: currentUser?.displayName ?? null,
    authorPhotoURL: currentUser?.photoURL ?? null,
    polls,
    group,
  };

  // Send POST request to create new post
  const res = await fetch("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  // Handle API response errors
  if (!res.ok) throw new Error((await res.json()).error || "Failed to create");
  return res.json();
}

/**
 * Fetches posts from the backend API with optional query parameters.
 *
 * @param {Object} [options] - Options for fetching posts.
 * @param {number} [options.limitCount=10] - Maximum number of posts to fetch.
 * @param {string} [options.orderByField="createdAt"] - Field to order posts by.
 * @param {string} [options.orderDirection="desc"] - Order direction ("asc" or "desc").
 * @returns {Promise<Array>} Resolves to an array of post objects.
 * @throws {Error} If the fetch fails or the server returns an error.
 */
export async function getPostsViaApi({
  limitCount = 10,
  orderByField = "createdAt",
  orderDirection = "desc",
} = {}) {
  // Build query parameters for API request
  const params = new URLSearchParams({
    limitCount,
    orderByField,
    orderDirection,
  });

  // Fetch posts with query parameters
  const res = await fetch(`/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch");
  return res.json();
}

/**
 * Renders the Create Post form UI and handles post creation logic.
 *
 * Allows users to compose a post with text, tags, images, and optional poll options.
 * Handles image uploads, poll option management, and form submission.
 * Fetches and displays the latest posts after a successful submission.
 *
 * @component
 * @returns {JSX.Element} The rendered Create Post form.
 */
export default function CreatePost() {
  // Get current authenticated user
  const { user: currentUser } = useAuth();

  // State for form inputs and UI control
  const [text, setText] = useState(""); // Post text content
  const [tags, setTags] = useState(""); // Comma-separated tags string
  const [submitting, setSubmitting] = useState(false); // Form submission loading state
  const [error, setError] = useState(""); // Error message display
  const [posts, setPosts] = useState([]); // List of fetched posts
  const [loading, setLoading] = useState(true); // Posts loading state
  const [pollOptions, setPollOptions] = useState([]); // Array of poll options
  const [files, setFiles] = useState([]); // Selected image files
  const [previews, setPreviews] = useState([]); // Image preview URLs
    const [group, setGroup] = useState("");
    const [groups, setGroups] = useState([]);
    const [loadingGroups, setLoadingGroups] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // Force component re-renders

  // Reference to hidden file input element
  const fileInputRef = useRef(null);

  /* === IMAGE UPLOAD FUNCTIONS === */

  /**
   * Opens the file picker dialog by clicking the hidden input
   */
  function openFilePicker() {
    fileInputRef.current?.click();
  }

  /**
   * Handles file selection from the file picker
   * Creates preview URLs and updates state with selected files
   */
  function onPickFiles(e) {
    const picked = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...picked]);

    // Create object URLs for image previews
    const newPreviews = picked.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  }

  /**
   * Removes a file and its preview from the selection
   * Cleans up object URLs to prevent memory leaks
   */
  function removePreview(idx) {
    URL.revokeObjectURL(previews[idx]); // Clean up memory
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  /* === POLL MANAGEMENT FUNCTIONS === */

  /**
   * Adds a new poll option (maximum of 4)
   */
  function handleAddOption() {
    setPollOptions((opts) =>
      opts.length >= 4 ? opts : [...opts, { label: "" }]
    );
  }

  /**
   * Updates the text of a specific poll option
   */
  function handleOptionChange(index, value) {
    setPollOptions((opts) =>
      opts.map((o, i) => (i === index ? { ...o, label: value } : o))
    );
  }

  /**
   * Removes a poll option from the list
   */
  function handleRemoveOption(index) {
    setPollOptions((opts) => opts.filter((_, i) => i !== index));
  }

  /**
   * Cleanup effect for image preview URLs
   * Prevents memory leaks by revoking object URLs when component unmounts
   */
  useEffect(() => {
    return () => previews.forEach(URL.revokeObjectURL);
  }, [previews]);

    // Fetch groups for the current user from Firestore
    useEffect(() => {
        const fetchGroups = async () => {
            setLoadingGroups(true);
            if (currentUser) {
                const db = getFirestore();
                // Query groups where 'users' array contains the current user's UID
                const q = query(
                    collection(db, "groups"),
                    where("members", "array-contains", currentUser.uid)
                );
                const groupSnap = await getDocs(q);
                const userGroups = groupSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setGroups(userGroups);
            } else {
                setGroups([]);
            }
            setLoadingGroups(false);
        };
        fetchGroups();
    }, [currentUser]);

  /**
   * Fetches the latest posts from the API and updates component state
   * Called after successful post creation to show updated feed
   */
  async function refreshPosts() {
    try {
      setLoading(true);
      const latest = await getPostsViaApi({
        limitCount: 10,
        orderByField: "createdAt",
        orderDirection: "desc",
      });

      setPosts(Array.isArray(latest) ? latest : []);
      setRefreshKey((prev) => prev + 1); // Force component updates
    } catch (err) {
      setError(err.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  /**
   * Fetch posts when component first mounts
   */
  useEffect(() => {
    refreshPosts();
  }, []);

  /**
   * Handles the form submission for creating a new post.
   *
   * Validates input, uploads images, formats poll options, and sends the post data to the backend.
   * Resets form state and refreshes the post list on success. Displays errors on failure.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>}
   */
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!text.trim()) return setError("Please enter some text.");
    if (!currentUser) return setError("Please log in before posting.");

    try {
      setSubmitting(true);

      // Upload selected images and get their URLs
      const { urls } = await uploadManyAndGetUrls(files, currentUser.uid);

      // Clean and validate poll options
      const cleanPolls = pollOptions
        .map((o) => ({ label: o.label.trim(), votes: 0 })) // Trim whitespace and initialize votes
        .filter((o) => o.label.length > 0) // Remove empty options
        .slice(0, 4); // Limit to 4 options max

      // Create the post via API
      await createPostViaApi({
        currentUser,
        content: text.trim(),
        mediaUrls: urls,
        tags: tags
          .split(",") // Split comma-separated string
          .map((t) => t.trim()) // Trim whitespace from each tag
          .filter(Boolean), // Remove empty tags
        polls: cleanPolls,
          group: group,
      });

      // Reset form state after successful submission
      setText("");
      setTags("");
      setFiles([]);
      previews.forEach(URL.revokeObjectURL); // Clean up preview URLs
      setPreviews([]);
      setPollOptions([]);
      setGroup("");

      // Refresh posts to show the new post
      await refreshPosts();
    } catch (err) {
      setError(err.message || "Failed to create post");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    // Main container for the create post form
    <div className="w-full mx-auto">
      {/* Form card with background and rounded corners */}
      <div className="bg-backgroundGrey p-4 rounded-3xl shadow-md">
        {/* Form header */}
        <h2 className="text-xl font-semibold mb-2 text-black text-left ml-4 pb-5">
          Create a post
        </h2>

        {/* Inner container with horizontal margins */}
        <div className="ml-10 mr-10">
          {/* Group selection section (placeholder for future functionality) */}
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="text-lg font-semibold text-black">Add to:</h3>
            {/* Group dropdown button*/}
                      <select name="Group" id="Group" className="inline-flex items-center justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                onChange={(e) => setGroup(e.target.value)}
                disabled={submitting}
                required >
                <option value="None">Public feed</option>
                {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                        {group.name}
                    </option>
                ))}
            </select>
          </div>

          {/* Text content section header */}
          <h3 className="text-lg font-semibold mb-2 text-black text-left">
            Add Text
          </h3>

          {/* Main form element with submission handler */}
          <form onSubmit={handleSubmit}>
            {/* Text and tags input container */}
            <div className="mb-2">
              <div className="block w-full p-4 rounded-lg bg-darkGrey">
                {/* Main text area for post content */}
                <textarea
                  id="medium-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={"What's on your mind?"}
                  disabled={submitting} // Disable during submission
                  rows={3}
                  className="text-sm w-full text-gray-900 focus:outline-none bg-darkGrey disabled:opacity-60"
                />

                {/* Tags section header */}
                <h3 className="text-md font-semibold mt-4 mb-2 text-black text-left">
                  Add Tags
                </h3>

                {/* Tags input field - comma-separated values */}
                <input
                  type="text"
                  id="small-input"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags (comma-separated)"
                  disabled={submitting}
                  className="w-full text-sm text-gray-900 rounded-md px-3 py-2 focus:outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Character counter for text content - TODO: needs fixing for 280 char limit */}
            <div className="text-xs text-gray-500 mb-4">{text.length}/280</div>

            {/* Media upload section header */}
            <h3 className="text-lg font-semibold mb-2 text-black text-left">
              Add to Your Post
            </h3>

            {/* Image upload container with drag-and-drop area */}
            <div className="relative mb-6 w-full min-h-56 bg-darkGrey px-4 py-8 rounded-lg">
              {/* Image previews grid - only shown when images are selected */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pr-14">
                  {previews.map((src, idx) => (
                    <div
                      key={src}
                      className="relative group rounded-md overflow-hidden border border-gray-200"
                    >
                      {/* Preview image */}
                      <img
                        src={src}
                        alt={`preview-${idx}`}
                        className="w-full h-32 object-cover"
                      />
                      {/* Remove image button - appears on hover */}
                      <button
                        type="button"
                        onClick={() => removePreview(idx)}
                        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition bg-white/90 text-gray-700 rounded px-1 text-xs border"
                        aria-label="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Hidden file input for image selection */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple // Allow multiple file selection
                className="hidden"
                onChange={onPickFiles}
              />

              {/* Add image button - positioned in bottom-right corner */}
              <button
                type="button"
                onClick={openFilePicker}
                className="absolute bottom-2 right-2 flex items-center justify-center rounded-md shadow-sm p-3 hover:bg-gray-50"
                aria-label="Add images"
                title="Add images"
              >
                <img src={imageIcon} alt="" className="h-6 w-6" />
              </button>
            </div>

            {/* Poll creation section header */}
            <h3 className="text-lg font-semibold mb-2 text-black text-left">
              Create Polls
            </h3>

            {/* Poll options container */}
            <div className="w-full text-left space-y-2">
              {/* Render existing poll options dynamically */}
              {pollOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {/* Poll option text input */}
                  <input
                    type="text"
                    value={opt.label}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Option ${idx + 1}`}
                    maxLength={80} // Limit option text length
                    disabled={submitting}
                    className="flex-grow max-w-[75%] bg-backgroundGrey text-sm text-gray-900 rounded-md px-3 py-2 focus:outline-none placeholder:text-gray-400"
                  />
                  {/* Remove option button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    className="text-sm px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    aria-label="Remove option"
                    disabled={submitting}
                  >
                    Remove
                  </button>
                </div>
              ))}

              {/* Add new poll option button - disabled when limit reached */}
              <button
                type="button"
                onClick={handleAddOption}
                disabled={pollOptions.length >= 4 || submitting} // Max 4 options
                className="bg-backgroundGrey text-gray-700 text-lg font-semibold pb-1 pt-0.5 px-2.5 rounded-lg disabled:opacity-50"
                title={
                  pollOptions.length >= 4
                    ? "Maximum 4 options"
                    : "Add poll option"
                }
              >
                +
              </button>

              {/* Poll option counter display */}
              <p className="text-xs text-gray-500">
                {pollOptions.length}/4 options
              </p>
            </div>

            {/* Error message display - shown when form validation fails */}
            {error && <p className="text-red-600 mt-4">{error}</p>}

            {/* Form submission section */}
            <div className="mt-4">
              {/* Submit button - disabled when submitting or no text content */}
              <button
                type="submit"
                disabled={submitting || !text.trim()}
                className="rounded-md bg-darkGrey text-black px-16 font-semibold py-2 disabled:opacity-60"
              >
                {/* Dynamic button text based on submission state */}
                {submitting ? "Posting..." : "Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

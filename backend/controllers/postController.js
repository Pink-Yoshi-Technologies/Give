const { db, admin } = require("../firebase/firebase");

/**
 * Create a new post and save it to Firestore.
 *
 * @param {import("express").Request} req - The request object containing post data.
 * @param {import("express").Response} res - The response object to send results.
 * @returns {Promise<void>} Sends a JSON response with the new post or error.
 *
 * @example
 * // POST /posts
 * // req.body = { content: "Hello world", authorId: "123" }
 * // Response: { id: "abc123", content: "Hello world", authorId: "123", ... }
 */
exports.createPost = async (req, res) => {
  try {
    const {
      content,
      mediaUrls = [],
      tags = [],
      authorId,
      authorDisplayName,
      authorPhotoURL,
        polls = [],
      group,
    } = req.body;

    if (!content || !content.trim())
      return res.status(400).json({ error: "Content is required" });

    // Create the post object
    const post = {
      authorId,
      authorDisplayName,
      authorPhotoURL,
      content: content.trim(),
      mediaUrls,
      tags,
      polls: Array.isArray(polls)
        ? polls
            .slice(0, 4)
            .map((p) => ({ label: String(p.label || "").trim(), votes: 0 }))
            .filter((p) => p.label)
        : [],
        group,
      voters: [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Add the post to Firestore
    const ref = await db.collection("posts").add(post);
    const snap = await ref.get();

    res.status(201).json({ id: ref.id, ...snap.data() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to create post" });
  }
};

/**
 * Get a list of posts from Firestore, ordered by creation date (newest first).
 *
 * @param {import("express").Request} req - The request object (query may include `limitCount`).
 * @param {import("express").Response} res - The response object used to send JSON.
 * @returns {Promise<void>} Sends an array of post objects in JSON format or an error.
 *
 * @example
 * // GET /posts?limitCount=5
 * // Response: [
 * //   { id: "abc123", content: "Hello world", authorId: "123", ... },
 * //   { id: "def456", content: "Another post", authorId: "456", ... }
 * // ]
 */
exports.getPosts = async (req, res) => {
  try {
      const limitCount = Number(req.query.limitCount ?? 10);
      const groupId = String(req.query.groupId ?? "default");
      var snap = await db
          .collection("posts")
          .orderBy("createdAt", "desc")
          .limit(limitCount)
          .get();
      if (groupId !== "default") {
        snap = await db
              .collection("posts")
              .where("group","==",groupId)
              .limit(limitCount)
              .get();
      }
    res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

/**
 * Handle poll voting for a specific post.
 * Increments the vote count for the selected poll option.
 *
 * @param {import("express").Request} req - The request object containing postId in params and optionIndex in body.
 * @param {import("express").Response} res - The response object to send results.
 * @returns {Promise<void>} Sends a JSON response with success status or error.
 *
 * @example
 * // POST /posts/:postId/vote
 * // req.params = { postId: "abc123" }
 * // req.body = { optionIndex: 1}
 * // Response: { success: true}
 */
exports.votePoll = async (req, res) => {
  try {
    // Extract postId from URL parameters and optionIndex from request body
    const { postId } = req.params;
    const { optionIndex } = req.body;

    // Log incoming vote request for debugging
    console.log("Vote request received:", { postId, optionIndex });

    // Validate that optionIndex is a number (required for array indexing)
    if (typeof optionIndex !== "number")
      return res.status(400).json({ error: "optionIndex is required" });

    // Get reference to the specific post document in Firestore
    const postRef = db.collection("posts").doc(postId);
    const postSnap = await postRef.get();

    // Check if the post exists in the database
    if (!postSnap.exists)
      return res.status(404).json({ error: "Post not found" });

    // Extract post data from Firestore document
    const postData = postSnap.data();

    // Log current poll state before making changes
    console.log(
      "Post data before vote:",
      JSON.stringify(postData.polls, null, 2)
    );

    // Validate that polls array exists and the requested option index is valid
    if (!Array.isArray(postData.polls) || !postData.polls[optionIndex])
      return res.status(400).json({ error: "Invalid poll option" });

    // Create a copy of the polls array to avoid mutating the original
    const updatedPolls = [...postData.polls];

    // Increment the vote count for the selected poll option
    // Use 0 as default if votes property doesn't exist
    updatedPolls[optionIndex] = {
      ...updatedPolls[optionIndex],
      votes: (updatedPolls[optionIndex].votes || 0) + 1,
    };

    // Log the updated polls array for debugging
    console.log("Updated polls array:", JSON.stringify(updatedPolls, null, 2));

    // Update the post document in Firestore with new poll data
    await postRef.update({
      polls: updatedPolls,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(), // Track when the vote was made
    });

    console.log("Vote update successful");

    // Retrieve the updated post to verify changes were saved correctly
    const updatedSnap = await postRef.get();
    console.log(
      "Post data after vote:",
      JSON.stringify(updatedSnap.data().polls, null, 2)
    );

    // Send success response to client
    res.json({ success: true });
  } catch (err) {
    // Log any errors that occur during the voting process
    console.error("Vote error:", err);

    // Send error response to client
    res.status(500).json({ error: "Failed to vote" });
  }
};

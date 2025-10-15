const { db, admin } = require("../firebase/firebase");
const { doc, updateDoc, arrayUnion } = require("firebase/firestore");

/**
 * Create a new post and save it to Firestore.
 *
 * @param {import("express").Request} req - The request object containing post data.
 * @param {import("express").Response} res - The response object to send results.
 * @returns {Promise<void>} Sends a JSON response with the new post or error.
 *
 * @example
 * // POST /groups
 * // req.body = { content: "Hello world", authorId: "123" }
 * // Response: { id: "abc123", content: "Hello world", authorId: "123", ... }
 */
exports.createGroup = async (req, res) => {
    try {
        const {
            content,
            authorId,
            description,
            privacy,
        } = req.body;

        if (!content || !content.trim())
            return res.status(400).json({ error: "Content is required" });

        // Create the post object
        const group = {
            name: content.trim(),
            members: [authorId],
            description,
            privacy
        };

        // Add the post to Firestore
        const ref = await db.collection("groups").add(group);
        const snap = await ref.get();

        res.status(201).json({ id: ref.id, ...snap.data() });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to create group" });
    }
};

/**
 * Get a list of groups from Firestore, ordered by name.
 *
 * @param {import("express").Request} req - The request object (query may include `limitCount`).
 * @param {import("express").Response} res - The response object used to send JSON.
 * @returns {Promise<void>} Sends an array of post objects in JSON format or an error.
 *
 * @example
 * // GET /groups?limitCount=5
 * // Response: [
 * //   { id: "abc123", content: "Hello world", authorId: "123", ... },
 * //   { id: "def456", content: "Another post", authorId: "456", ... }
 * // ]
 */
exports.getGroups = async (req, res) => {
    try {
        const limitCount = Number(req.query.limitCount ?? 10);
        const snap = await db
            .collection("groups")
            .orderBy("name")
            .limit(limitCount)
            .get();
        res.json(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Failed to fetch groups" });
    }
};


/**
 * Add user to group members array
 * 
 * @param {import("express").Request} req - The request object (query may include `limitCount`).
 * @param {import("express").Response} res - The response object used to send JSON.
 * @returns {Promise<void>} Sends an array of post objects in JSON format or an error.
 * 
 * @example
 * // POST /groups/join
 * // req.body = { authorId: "123", dId = "456" }
 * // Response: { }
 */
exports.joinGroup = async (req, res) => {
    try {
        const {
            authorId,
            dId,
        } = req.body;


        const groupRef = db.collection("groups").doc(dId);
        const groupSnap = await groupRef.get();

        // Check if the post exists in the database
        if (!groupSnap.exists)
            return res.status(404).json({ error: "Group not found" });

        await groupRef.update({
            members: admin.firestore.FieldValue.arrayUnion(authorId)
        });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: "Failed to add user to group" });
    }
}


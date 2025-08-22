const { db, admin } = require('../firebase/firebase');

exports.createPost = async (req, res) => {
  try {
    const { content, mediaUrls = [], tags = [], authorId, authorDisplayName, authorPhotoURL } = req.body;
    if (!content || !content.trim()) return res.status(400).json({ error: 'Content is required' });

    const post = {
      authorId,
      authorDisplayName,
      authorPhotoURL,
      content: content.trim(),
      mediaUrls,
      tags,
      // polls: Array.isArray(polls) ? polls.slice(0,4).map(p => ({ label: String(p.label || "").trim() })).filter(p => p.label) : [],
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const ref = await db.collection('posts').add(post);
    const snap = await ref.get();
    res.status(201).json({ id: ref.id, ...snap.data() });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const limitCount = Number(req.query.limitCount ?? 10);
    const snap = await db.collection('posts')
      .orderBy('createdAt', 'desc')
      .limit(limitCount)
      .get();
    res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
};
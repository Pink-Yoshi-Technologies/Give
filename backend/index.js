const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { admin, db } = require('./firebase/firebase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simple request logger to help debug routing/network issues
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.post('/api/saveProfile', async (req, res) => {
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : authHeader;
  if (!token) return res.status(401).json({ error: 'Missing auth token' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const uid = decoded.uid;
    const profile = {
      uid,
      firstName: req.body.firstName || null,
      lastName: req.body.lastName || null,
      displayName: req.body.displayName || null,
      email: req.body.email || null,
      birthday: req.body.birthday || null,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('users').doc(uid).set(profile, { merge: true });
    return res.json({ success: true });
  } catch (err) {
    console.error('saveProfile failed:', err);
    return res.status(403).json({ error: err.message || 'Unauthorized' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

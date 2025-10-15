const { admin } = require('../../firebase/firebase');

/**
 * Handle Firebase logout by revoking the user's refresh tokens.
 *
 * Expects an Authorization header bearing a Firebase ID token.
 * The ID token is verified and the associated user's refresh tokens are revoked,
 * ensuring the current session is invalidated across devices.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
module.exports = async function logoutController(req, res) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    await admin.auth().revokeRefreshTokens(decoded.uid);
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[logoutController] Failed to revoke tokens', error);
    return res.status(403).json({ error: 'Failed to logout user' });
  }
};

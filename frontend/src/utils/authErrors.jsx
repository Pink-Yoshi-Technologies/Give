/**
 * authErrors module
 *
 * Translates Firebase Authentication errors into user-friendly messages suitable
 * for display in the UI. Handles both structured error.code values and cases
 * where the code is embedded inside the error.message string.
 *
 * @module authErrors
 */

/**
 * Map a Firebase Auth error to a friendly string.
 *
 * This function prefers the canonical `err.code` (e.g. "auth/invalid-email"),
 * but will attempt to extract an "auth/xxx" token from `err.message` if `code`
 * is not present. Fallbacks inspect the message text for simple heuristics.
 *
 * @param {Error|object} err - The error object thrown by Firebase (may include `.code` and `.message`)
 * @returns {string} A user-facing error message
 *
 * @example
 * // With a canonical code:
 * mapAuthError({ code: 'auth/wrong-password' }); // "Incorrect password. Please try again."
 *
 * @example
 * // With message containing code:
 * mapAuthError({ message: 'Firebase: Error (auth/invalid-credential).' }); // "The credentials provided are invalid. Please try again."
 */
const mapAuthError = (err) => {
  if (!err) return 'An unknown error occurred.';

  // prefer the explicit error.code when available
  let code = err.code || '';

  // raw message lowercased for message-based heuristics
  const rawMessage = err.message || '';
  const message = rawMessage.toLowerCase();

  // if code missing, try to extract pattern like "auth/xxx" from the message
  if (!code) {
    const m = rawMessage.match(/\(?(auth\/[a-z0-9-_.]+)\)?/i);
    if (m && m[1]) code = m[1].toLowerCase();
  }

  // map known Firebase Auth codes to user-friendly messages
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Try signing in or use a different email.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password is too weak. Use at least 6 characters.';
    case 'auth/invalid-credential':
      return 'The credentials provided are invalid. Please try again.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/user-not-found':
      return 'No account found with that email. Please create an account.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection and try again.';
    case 'auth/permission-denied':
      return 'You do not have permission to perform this action.';
    default:
      // fallback heuristics based on message content when no known code matched
      if (message.includes('email')) return 'There is a problem with the email provided.';
      if (message.includes('password')) return 'There is a problem with the password provided.';

      // final fallback: return original message if present, otherwise generic notice
      return err.message || 'Something went wrong. Please try again.';
  }
};

export default mapAuthError;

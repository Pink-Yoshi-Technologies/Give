// Maps Firebase Auth error codes/messages to user-friendly text
const mapAuthError = (err) => {
  if (!err) return 'An unknown error occurred.';
  // prefer canonical code, but some Firebase errors only include the code inside the message
  let code = err.code || '';
  const rawMessage = err.message || '';
  const message = rawMessage.toLowerCase();
  if (!code) {
    // try to extract "auth/xxx" from message like "Firebase: Error (auth/invalid-credential)."
    const m = rawMessage.match(/\(?(auth\/[a-z0-9-_.]+)\)?/i);
    if (m && m[1]) code = m[1].toLowerCase();
  }

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
      // fallback to simple patterns in message text
      if (message.includes('email')) return 'There is a problem with the email provided.';
      if (message.includes('password')) return 'There is a problem with the password provided.';
      return err.message || 'Something went wrong. Please try again.';
  }
};

export default mapAuthError;

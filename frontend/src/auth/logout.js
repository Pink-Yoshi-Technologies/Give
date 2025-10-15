import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5002';

const clearStorage = (storage) => {
  if (!storage) return;
  const keysToRemove = [];
  for (let i = 0; i < storage.length; i += 1) {
    const key = storage.key(i);
    if (!key) continue;
    if (key.includes('firebase') || key.includes('auth') || key.includes('GiveUser')) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((key) => storage.removeItem(key));
};

const clearCookies = () => {
  if (typeof document === 'undefined' || !document.cookie) return;
  const cookies = document.cookie.split(';');
  cookies.forEach((cookie) => {
    const [rawName] = cookie.trim().split('=');
    if (!rawName) return;
    if (rawName.toLowerCase().includes('firebase') || rawName.toLowerCase().includes('auth')) {
      document.cookie = `${rawName}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  });
};

/**
 * Logs the current Firebase user out and revokes refresh tokens on the backend.
 *
 * @returns {Promise<void>}
 */
export default async function logoutUser() {
  const user = auth.currentUser;
  let token = null;

  try {
    token = user ? await user.getIdToken() : null;
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[logout] Unable to retrieve ID token before logout', error);
    }
  }

  if (token) {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('[logout] Backend logout request failed', error);
      }
    }
  }

  try {
    await signOut(auth);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[logout] Firebase signOut failed', error);
    }
  }

  if (typeof window !== 'undefined') {
    clearStorage(window.localStorage);
    clearStorage(window.sessionStorage);
  }
  clearCookies();
}

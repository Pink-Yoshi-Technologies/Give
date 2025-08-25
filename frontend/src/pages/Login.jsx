/**
 * Login page
 *
 * Renders the sign-in form and handles user authentication via Firebase.
 * - Allows a user to sign in with email and password
 * - If a different user is currently signed in, attempts to sign them out first
 * - Maps Firebase errors to friendly messages using mapAuthError
 *
 * Usage:
 *  - Route to this page for user authentication.
 *
 * @module Login
 */
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import mapAuthError from '../utils/authErrors';

/**
 * Login component
 *
 * Manages local state for email/password inputs and handles the sign-in flow.
 * Shows simple success/error messages and navigates to /home on success.
 *
 * @component
 * @returns {JSX.Element} The rendered login page
 */
const Login = () => {
  // input state control for email & password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state for error/success messages
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  /**
   * Handle user sign-in.
   *
   * Flow:
   *  - Clear any existing messages
   *  - If a different user is currently signed in, attempt to sign them out first
   *  - Call Firebase signInWithEmailAndPassword
   *  - On success show a brief success message and navigate to /home
   *  - On failure map the error to a friendly message
   *
   * @async
   * @function handleLogin
   * @returns {Promise<void>}
   */
  const handleLogin = async () => {
    setError("");
    setSuccess("");
    try {
      // if a different user currently signed in, sign them out first
      if (auth.currentUser && auth.currentUser.email && auth.currentUser.email !== email) {
        if (process.env.NODE_ENV !== 'production') console.log('Signing out current user before sign-in attempt', auth.currentUser.email);
        try {
          await signOut(auth);
        } catch (signOutErr) {
          // log sign-out failure in non-production but continue to attempt sign-in
          if (process.env.NODE_ENV !== 'production') console.error('Failed to sign out existing user before signIn:', signOutErr);
        }
      }

      // attempt Firebase email/password sign-in
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Logged in successfully");

      // redirect to home after a short delay (gives user feedback)
      setTimeout(() => navigate("/home"), 400);
    } catch (err) {
      // convert Firebase error to a user-friendly message for display
      setError(mapAuthError(err));
    }
  };

  return (
    <div className="flex w-full h-screen bg-backgroundGrey font-[Nunito,Poppins,sans-serif]">
      {/* Left branding column */}
      <div className="w-[45%] flex justify-start items-center pl-[100px]">
        <div className="flex flex-col mb-[70px] ml-[25px] gap-1">
          <header>
            <h1 className="text-defaultYellow text-[7rem] uppercase m-0 text-left font-header">
              Give
            </h1>
          </header>
          <p className="text-defaultYellow text-2xl m-0 text-left">
            Can't decide? Let them vote.
          </p>
        </div>
      </div>

      {/* Right form column */}
      <div className="w-[45%] flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-[600px] flex flex-col gap-4 ml-12">
          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            className="bg-pink-50 text-black px-4 py-3 border border-backgroundGrey rounded-lg text-base outline-none focus:border-pink-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            className="bg-pink-50 text-black px-4 py-3 border border-backgroundGrey rounded-lg text-base outline-none focus:border-pink-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Error message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Success message (brief feedback) */}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          {/* Primary login button */}
          <button
            className="bg-pink-200 text-white py-3 rounded-lg text-lg hover:bg-pink-400 transition-colors"
            onClick={handleLogin}
          >
            Log In
          </button>

          {/* Navigate to create account page */}
          <button
            className="bg-defaultYellow text-white py-3 rounded-lg text-lg hover:bg-[#d2b122] transition-colors"
            onClick={() => navigate("/create-account")}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

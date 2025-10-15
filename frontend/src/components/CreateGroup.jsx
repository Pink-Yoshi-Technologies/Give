import React, { useEffect, useState, useRef } from "react";
import "../styles/index.css";
import { useAuth } from "../contexts/AuthContext";

/**
 * Creates a new post via the backend API.
 *
 * @param {Object} params - Parameters for creating the post.
 * @param {Object} params.currentUser - The current user object (must have uid, displayName, photoURL).
 * @param {string} params.content - The text content of the post.
 * @returns {Promise<Object>} Resolves to the created post object.
 * @throws {Error} If the request fails or the server returns an error.
 */
export async function createGroupViaApi({
    currentUser,
    content,
    description,
    privacy,
}) {
    // Construct request body with user info and post data
    const body = {
        content,
        description,
        authorId: currentUser?.uid ?? null,
        privacy: privacy ?? false,
    };

    // Send POST request to create new post
    const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    // Handle API response errors
    if (!res.ok) throw new Error((await res.json()).error || "Failed to create");
    return res.json();
}

/**
 * Renders the Create Group form UI and handles group creation logic.
 *
 * Allows users to compose a group with a gorup name.
 *
 * @component
 * @returns {JSX.Element} The rendered Create Post form.
 */
export default function CreateGroup() {
    // Get current authenticated user
    const { user: currentUser } = useAuth();

    // State for form inputs and UI control
    const [text, setText] = useState(""); // Post text content
    const [desc, setDesc] = useState("");
    const [privacySetting, setPrivacy] = useState("");
    const [submitting, setSubmitting] = useState(false); // Form submission loading state
    const [error, setError] = useState(""); // Error message display
    const [loading, setLoading] = useState(true); // Posts loading state
    const [refreshKey, setRefreshKey] = useState(0); // Force component re-renders


    /**
     * Handles the form submission for creating a new post.
     *
     * Resets form state and refreshes the group list on success. Displays errors on failure.
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

        var privacy = false;

        try {
            setSubmitting(true);
            if (privacySetting === "Private") {
                privacy = true;
            }
            // Create the post via API
            await createGroupViaApi({
                currentUser,
                content: text.trim(),
                description: desc.trim(),
                privacy,
            });

            // Reset form state after successful submission
            setText("");
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
                    Create a group
                </h2>

                {/* Inner container with horizontal margins */}
                <div className="ml-10 mr-10">

                    {/* Text content section header */}
                    <h3 className="text-lg font-semibold mb-2 text-black text-left">
                        Group Name
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
                                    placeholder={"Enter group name: "}
                                    disabled={submitting} // Disable during submission
                                    rows={1}
                                    className="text-sm w-full text-gray-900 focus:outline-none bg-darkGrey disabled:opacity-60"
                                />

                            </div>
                        </div>

                        {/* Text content section header */}
                        <h3 className="text-lg font-semibold mb-2 text-black text-left">
                            Group Description
                        </h3>

                        {/* Main form element with submission handler */}
                            {/* Text and tags input container */}
                            <div className="mb-2">
                                <div className="block w-full p-4 rounded-lg bg-darkGrey">
                                    {/* Main text area for post content */}
                                    <textarea
                                        id="medium-input"
                                        value={desc}
                                        onChange={(e) => setDesc(e.target.value)}
                                        placeholder={"Enter group description: "}
                                        disabled={submitting} // Disable during submission
                                        rows={3}
                                        className="text-sm w-full text-gray-900 focus:outline-none bg-darkGrey disabled:opacity-60"
                                    />

                                </div>
                            </div>

                        <div className="flex items-center space-x-2 mb-4">
                            <h3 className="text-lg font-semibold text-black">Group privacy:</h3>
                            {/* Group privacy settings - ceither public or private(invite/request only) */}
                            <select name="privacy" id="privacy"
                                onChange={(e) => setPrivacy(e.target.value)}
                                disabled={submitting}
                                required >
                                <option value="Public">Public</option>
                                <option value="Private">Private</option>
                            </select>
                        </div>

                        {/* Error message display - shown when form validation fails */}
                        {error && <p className="text-red-600 mt-4">{error}</p>}

                        {/* Form submission section */}
                        <div className="mt-4">
                            {/* Submit button - disabled when submitting or no text content */}
                            <button
                                type="submit"
                                disabled={submitting || !text.trim()}
                                className="rounded-md bg-darkGrey text-black px-16 font-semibold py-2 disabled:opacity-60">
                                {/* Dynamic button text based on submission state */}
                                {submitting ? "Creating group..." : "Create group"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

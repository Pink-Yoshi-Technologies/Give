import { useState, useEffect } from "react";
import { usePostsRefresh } from "./PostsContainer";

/**
 * PollBox Component
 *
 * Renders an interactive poll with voting functionality.
 * Shows poll options before voting and results with percentages after voting.
 *
 * @param {string} postId - Unique identifier for the post containing this poll
 * @param {Array} initialOptions - Array of poll options with labels and vote counts
 */
export default function PollBox({ postId, initialOptions }) {
  // Access the Posts refresh functionality
  const { refreshPosts } = usePostsRefresh();
  
  // State to track if the current user has voted on this poll
  const [hasVoted, setHasVoted] = useState(false);

  // State to track if a vote submission is in progress
  const [voting, setVoting] = useState(false);

  // Local copy of poll options that updates when initialOptions change
  const [currentOptions, setCurrentOptions] = useState(initialOptions);

  /**
   * Effect to update local options when parent component refreshes data
   * This ensures the component displays the latest vote counts
   */
  useEffect(() => {
    setCurrentOptions(initialOptions);
  }, [initialOptions]);

  /**
   * Calculate total votes across all poll options
   * Used for percentage calculations and display
   */
  const totalVotes = currentOptions.reduce(
    (sum, opt) => sum + (opt.votes || 0),
    0
  );

  /**
   * Calculate percentage of votes for a specific option
   * @param {number} optionVotes - Number of votes for this option
   * @returns {number} Percentage rounded to nearest whole number
   */
  const getPercentage = (optionVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((optionVotes / totalVotes) * 100);
  };

  /**
   * Handle voting for a specific poll option
   * Sends vote to backend, refreshes data, and updates UI state
   *
   * @param {number} optionIndex - Index of the selected poll option
   */
  const handleVote = async (optionIndex) => {
    // Prevent voting if already voted or currently submitting
    if (hasVoted || voting) return;

    // Set loading state
    setVoting(true);
    console.log(`Voting for option ${optionIndex} on post ${postId}`);

    try {
      // Send vote request to backend API
      const res = await fetch(`/api/posts/${postId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionIndex }),
      });

      console.log("Vote response status:", res.status);

      // Handle API errors
      if (!res.ok) {
        const data = await res.json();
        console.error("Vote error:", data);
        throw new Error(data.error || "Failed to vote");
      }

      console.log("Vote successful, refreshing posts...");

      // Refresh post data to sync with backend first
      await refreshPosts();

      console.log("Posts refreshed, updating UI to show results...");

      // Only after successful refresh, update local state and show results
      const updatedOptions = [...currentOptions];
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        votes: (updatedOptions[optionIndex].votes || 0) + 1,
      };
      setCurrentOptions(updatedOptions);

      // Update UI to show results instead of voting options
      setHasVoted(true);
    } catch (err) {
      console.error("Vote failed:", err);
      // Note: Error handling could be improved with user feedback
    } finally {
      // Clear loading state regardless of success/failure
      setVoting(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Voting instructions - only shown before user votes */}
      {!hasVoted && !voting && (
        <div className="text-xs text-gray-600 mb-1">Click to vote</div>
      )}

      {/* Poll options list */}
      {currentOptions.map((option, index) => {
        const percentage = getPercentage(option.votes || 0);

        return (
          <div
            key={index}
            role="button"
            tabIndex={0}
            className={`relative bg-pollBarGrey rounded-[0.6rem] ${
              !hasVoted && !voting
                ? "hover:bg-pollBarHover cursor-pointer" // Interactive styles when voting is available
                : "cursor-default" // Static appearance after voting
            }`}
            onClick={() => !hasVoted && !voting && handleVote(index)}
            onKeyDown={(e) => {
              // Keyboard accessibility for voting
              if (
                (e.key === "Enter" || e.key === " ") &&
                !hasVoted &&
                !voting
              ) {
                e.preventDefault(); // Prevent scrolling for Space key
                handleVote(index);
              }
            }}
          >
            {/* Progress bar showing vote percentage - only visible after voting */}
            {hasVoted && (
              <span
                className="absolute top-0 left-0 h-full transition-all duration-500 bg-defaultYellow rounded-[0.6rem]"
                style={{ width: `${percentage}%` }}
              />
            )}

            {/* Option content container */}
            <div className="relative font-normal text-black text-[0.8rem] leading-[3.1] px-4 py-2 rounded-[0.6rem] flex justify-between items-center">
              {/* Option label */}
              <span>{option.label}</span>

              {/* Vote statistics - only shown after voting */}
              {hasVoted && (
                <div className="flex items-center gap-2 text-xs">
                  <span>{option.votes || 0} votes</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Total vote count - only shown after voting */}
      {hasVoted && (
        <div className="text-xs text-gray-500 mt-1">
          Total votes: {totalVotes}
        </div>
      )}

      {/* Loading indicator during vote submission */}
      {voting && (
        <div className="text-xs text-blue-500">Submitting vote...</div>
      )}
    </div>
  );
}

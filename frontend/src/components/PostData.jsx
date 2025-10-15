import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../styles/App.css";
import PollBox from "./PollBox";

/**
 * Base configuration settings for the React Slick image slider
 * These settings provide default behavior for image carousels
 */
const baseSettings = {
  dots: true, // Show navigation dots below slider
  infinite: true, // Enable infinite loop scrolling
  speed: 500, // Transition speed in milliseconds
  slidesToScroll: 1, // Number of slides to scroll at once
  autoplay: true, // Enable automatic slide progression
  autoplaySpeed: 1000, // Time between auto-slide transitions (1 second)
  variableWidth: true, // Allow slides to have different widths
  dotsClass: "my-slick-dots", // Custom CSS class for navigation dots
  arrows: false, // Disable left/right arrow navigation
};

/**
 * PostData Component
 *
 * Renders the main content area of a social media post, including:
 * - Optional question text
 * - Main text content
 * - Image slider (if images are present)
 * - Interactive polls (if poll data exists)
 * - Hashtags display
 *
 * @param {Object} post - The post object containing all post data
 */
const PostData = ({ post }) => {
  // Extract and validate question text (fallback to empty string)
  const question = post?.question ?? "";

  // Extract text content, ensuring it's a string type
  const contentText = typeof post?.content === "string" ? post.content : "";

  // Extract images array with fallback logic
  // Checks both mediaUrls and content properties for backwards compatibility
  const images = Array.isArray(post?.mediaUrls)
    ? post.mediaUrls
    : Array.isArray(post?.content)
    ? post.content
    : [];

  // Extract tags array with fallback to empty array
  const tags = Array.isArray(post?.tags) ? post.tags : [];

  // Extract polls array with fallback to empty array
  const polls = Array.isArray(post?.polls) ? post.polls : [];

  /**
   * Dynamically adjust slider settings based on the number of images
   * - slidesToShow: Show 1-2 slides based on available images
   * - infinite: Only enable infinite scroll if there are multiple images
   * - autoplay: Only auto-advance if there are multiple images to show
   */
  const settings = {
    ...baseSettings,
    slidesToShow: Math.min(2, Math.max(1, images.length)), // Show 1-2 slides max
    infinite: images.length > 1, // Infinite scroll only with multiple images
    autoplay: images.length > 1, // Autoplay only with multiple images
  };

  return (
    <div className="w-full flex flex-col gap-4 justify-start py-4">
      {/* Question Section - Only render if question exists */}
      {question && <div className="text-left text-xs">{question}</div>}

      {/* Main Content Text - Only render if content exists */}
      {/* whitespace-pre-wrap preserves line breaks and spacing from original text */}
      {contentText && (
        <p className="text-left whitespace-pre-wrap text-sm">{contentText}</p>
      )}

      {/* Image Slider Section - Only render if images exist */}
      {images.length > 0 && (
        <Slider {...settings} className="post-slider">
          {images.map((src, index) => (
            <div key={index} className="flex items-center">
              <img
                src={src}
                alt={`Post image ${index + 1}`}
                className="h-28 px-2 rounded-[10%] object-cover"
                loading="lazy" // Optimize performance with lazy loading
              />
            </div>
          ))}
        </Slider>
      )}

      {/* Interactive Poll Section - Only render if poll data exists */}
      {polls.length > 0 && (
        <PollBox
          postId={post.id} // Unique identifier for voting API calls
          initialOptions={polls} // Poll options and current vote counts
          post={post} // Full post object for vote tracking
        />
      )}

      {/* Hashtags Section - Only render if tags exist */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="text-xs bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full"
            >
              {/* Ensure hashtag format: add # if missing, remove duplicates */}
              #{String(tag).replace(/^#/, "")}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PostData;

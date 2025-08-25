import clsx from "clsx";

/**
 * UserCard component displays a user's avatar, name, and group.
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - User object containing user information
 * @param {Object} props.group - Group object containing group information
 */
const UserCard = ({ user, group }) => {
  const name = user?.name;
  // Use special profile image for specific user IDs, otherwise use user's profilePic or default
  let profilePic = user?.profilePic || "/images/noPfp.jpg";
  if (user?.id === "NriIZ1wx4qXPRJfkXxOqS0dppHA2") {
    profilePic = "/images/profile.jpg";
  } else if (user?.id === "jTm7DVQeS0a7b5X72rbqVwwq9kb2") {
    profilePic = "/images/wowowprofile.jpg";
  } else if (user?.id === "hJ2fkfnlrPSk3mG6jtqLQxJlpgj2") {
    profilePic = "/images/jayde.jpg";
  }
  const groupName = group?.name;

  return (
    <div className="grid grid-cols-[min-content_auto_min-content] w-full bg-gray-100 rounded-xl">
      <div
        className="w-14 h-14 rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${profilePic})` }}
      >
        {user?.profilePic && (
          <img
            src={profilePic}
            alt={name ?? "user avatar"}
            className={clsx(
              "w-full h-full rounded-full border-2 border-[#D9D9D9] p-2",
              { "bg-white": !!user.profilePic }
            )}
          />
        )}
      </div>
      <div className="text-left px-4 flex flex-col justify-center">
        {/* Display username */}
        {name && (
          <p className="font-semibold text-[1.2rem] leading-4 lowercase">
            @{name}
          </p>
        )}
        {/* Display group name if available */}
        {groupName && (
          <p className="text-xs leading-8">
            posted to <span className="font-semibold">{groupName}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default UserCard;
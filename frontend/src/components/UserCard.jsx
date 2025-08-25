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
  const profilePic = user?.userId ? `/images/${user.userId}.jpg` : "/images/noPfp.jpg";
  const groupName = group?.name;

  return (
    <div className="grid grid-cols-[min-content_auto_min-content] w-full bg-gray-100 rounded-xl">
      <div
        className="w-14 h-14 rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${profilePic})` }}
      >
        <img
          src={profilePic}
          alt={name ?? "user avatar"}
          className={clsx(
            "w-full h-full rounded-full border-2 border-[#D9D9D9] p-2",
            { "bg-white": !!user?.userId }
          )}
          onError={e => { e.target.onerror = null; e.target.src = "/images/noPfp.jpg"; }}
        />
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

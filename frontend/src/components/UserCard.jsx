import clsx from "clsx";

const UserCard = ({ user, group, timeLeft }) => {
  const name = user?.name;
  const profilePic = user?.profilePic || "/images/noPfp.jpg";
  const groupName = group?.name;

  return (
    <div className="grid grid-cols-[min-content_auto_min-content] w-full bg-gray-100 rounded-xl">
      <div
        className="w-14 h-14 rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${profilePic})` }}
      >
        {user?.profilePic && (
          <img
            src={user.profilePic}
            alt={name ?? "user avatar"}
            className={clsx(
              "w-full h-full rounded-full border-2 border-[#D9D9D9] p-2",
              { "bg-white": !!user.profilePic }
            )}
          />
        )}
      </div>
      <div className="text-left px-4 flex flex-col justify-center">
        {name && (
          <p className="font-semibold text-[1.2rem] leading-4 lowercase">
            @{name}
          </p>
        )}
        {groupName && (
          <p className="text-xs leading-8">
            posted to <span className="font-semibold">{groupName}</span>
          </p>
        )}
      </div>
      <div className="flex items-start whitespace-nowrap text-xs">
        {timeLeft && <span>{timeLeft} left</span>}
      </div>
    </div>
  );
};

export default UserCard;

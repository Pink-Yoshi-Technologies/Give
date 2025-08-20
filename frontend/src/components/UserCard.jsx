import clsx from 'clsx';

const UserCard = ({ user, group, timeLeft }) => {
  return (
    <div className="grid grid-cols-[min-content_auto_min-content] w-full bg-gray-100 rounded-xl">
      <div
        className="w-14 h-14 rounded-full bg-cover bg-center bg-no-repeat flex items-center justify-center"
        style={{ backgroundImage: `url(${user.profilePic || '/images/noPfp.jpg'})` }}
      >
        <img
          src={user.profilePic}
          alt={user.name}
          className={clsx('w-full h-full rounded-full border-2 border-darkGrey p-2', { 'bg-white': user.profilePic })}
        />
      </div>
      <div className="text-left px-4 flex flex-col justify-center">
        <p className="font-semibold text-[1.2rem] leading-4 lowercase">@{user.name}</p>
        <p className="text-xs leading-8">posted to <span className="font-semibold">{group.name}</span></p>
      </div>
      <div className="flex items-start whitespace-nowrap text-xs">
        <span>{timeLeft} left</span>
      </div>
    </div>
  );
};

export default UserCard;

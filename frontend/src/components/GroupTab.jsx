import React, { useState } from "react";
import clsx from "clsx";

export default function GroupTab({ id }) {
  const [showMembers, setShowMembers] = useState(false);

  const members = [
    "@katesmith0001",
    "@katesmith0001",
    "@katesmith0001",
    "@katesmith0001",
    "@katesmith0001",
    "@katesmith0001",
  ];
  const group = {
    id: "1",
    name: "Group 1",
    profilePic: "group1.jpg",
    members: members,
  };

  return (
    <div className="w-full rounded-xl h-full">
      <div className={`bg-backgroundGrey rounded-3xl p-3 flex flex-col ${showMembers ? 'h-full' : ''}`}>
        {/* Group Header */}
        <div className="flex items-center p-4 rounded-xl  bg-defaultYellow gap-3">
          <div className={clsx("w-10 h-10 rounded-full overflow-hidden border-2 border-white", { "bg-gray-300": !group.profilePic })}>
            <img
              src={group.profilePic ? `images/${group.profilePic}` : "/images/placeholder.svg"}
              alt={`${group.name} profile`}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-semibold text-base text-black">{"Group "+ id}</p>
            <p className="text-xs text-black-600">{group.members.length} members</p>
          </div>
        </div>

        {/* Most Used Tags */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-left text-black">
            Most Used Tags
          </h3>
          <ul className="text-xs mt-2 leading-6 font-medium text-black">
            <li className="flex justify-between items-center cursor-pointer pl-2">
              #snacks{" "}
              <img
                src="/arrow.svg"
                alt="arrow right"
                style={{ width: "0.75em", height: "0.75em" }}
              />
            </li>
            <li className="flex justify-between items-center cursor-pointer pl-2">
              #movie{" "}
              <img
                src="/arrow.svg"
                alt="arrow right"
                style={{ width: "0.75em", height: "0.75em" }}
              />
            </li>
            <li className="flex justify-between items-center cursor-pointer pl-2">
              #dinner{" "}
              <img
                src="/arrow.svg"
                alt="arrow right"
                style={{ width: "0.75em", height: "0.75em" }}
              />
            </li>
          </ul>
        </div>

        {/* View Members */}
        <div className='mt-5 with-scrollbar overflow-y-auto flex-1'>
          <button
            className="flex justify-between w-full font-semibold text-sm"
            onClick={() => setShowMembers(!showMembers)}
          >
            View Members
            <span>
              {showMembers ? (
                <img
                  src="/arrow.svg"
                  alt="arrow up"
                  style={{
                    width: "0.75em",
                    height: "0.75em",
                    transform: "rotate(-90deg)",
                  }}
                />
              ) : (
                <img
                  src="/arrow.svg"
                  alt="arrow down"
                  style={{
                    width: "0.75em",
                    height: "0.75em",
                    transform: "rotate(90deg)",
                  }}
                />
              )}
            </span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-500 ease-in-out ${
              showMembers ? "max-h-96 opacity-100" : "max-h-0 opacity-0 hidden with-scrollbar"
            }`}
          >
            <ul className="mt-3 space-y-2">
              {members.map((name, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/1946/1946429.png"
                    alt="avatar"
                    className="w-5 h-5"
                  />
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}


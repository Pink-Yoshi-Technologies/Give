import React from "react";

/*
  SuggestedBox displays a list of suggested tags and groups for quick navigation.
  It is used in the sidebar to help users discover popular topics and groups.
*/
export default function SuggestedBox() {
  const tags = ["#snacks", "#movie", "#dinner"];
  const groups = [
    { id: 1, name: "Group 1"},
    { id: 2, name: "Group 2"},
    { id: 3, name: "Group 3"},
    { id: 4, name: "Group 4"}
  ]

    function GroupItem({ group }) {
      const { id, name, profilePic } = group;
      return (
        <li className="flex items-center rounded-xl gap-4 p-2 hover:bg-gray-100 cursor-pointer">
          <a href={`/group?id=${id}`} className="font-semibold text-base text-black">{name}</a>
        </li>
      )
    }

  return (
    <div className="w-full">
      <div className="bg-backgroundGrey rounded-3xl p-4 shadow-sm">

        {/* Suggested */}
        <div>
          <p className="font-semibold text-base text-black text-left">Suggested</p>
        </div>

        {/* Tags */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-left text-black">Tags</h3>
          <ul className="text-xs font-semibold mt-2 leading-6 text-black">
            {tags.map((tag) => (
              <li key={tag} className="flex justify-between items-center cursor-pointer pl-2">
                {/* Tag name */}
                {tag}
                {/* Arrow icon for navigation */}
                <img
                  src="/arrow.svg"
                  alt="arrow right"
                  style={{ width: "0.75em", height: "0.75em" }}
                />
              </li>
            ))}
          </ul>
        </div>

        {/* Groups */}
        <div className="mt-5">
          <h3 className="text-sm font-semibold text-left text-black">Groups</h3>
          <ul className="text-xs font-semibold mt-2 leading-6 text-black">
            {groups.map((group) => (
               <a key={group.id} href={`/group?id=${group.id}`}>
                <li className="flex justify-between items-center cursor-pointer pl-2">
                  {group.name}
                    <img
                      src="/arrow.svg"
                      alt="arrow right"
                      style={{ width: "0.75em", height: "0.75em" }}
                    />
                </li>
              </a>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
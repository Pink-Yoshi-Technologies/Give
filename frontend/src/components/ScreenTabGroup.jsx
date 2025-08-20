import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ScreenTab() {

  return (
    <div className="w-full rounded-xl">
      <div className="bg-backgroundGrey rounded-3xl p-4 flex flex-col gap-1.5">

        {/* Containers for each option */}
        <div className="flex items-center p-2 rounded-xl bg-defaultYellow gap-3"
          >
              <img
                src="/groups.svg"
                alt="groups icon"
                style={{ width: "1.5em", height: "1.5em" }}
              />
              <p className="font-semibold text-base text-black">View Group</p>
        </div>
        <Link
            to="/home"
            className="flex items-center p-2 rounded-xl bg-backgroundGrey gap-3 hover:bg-lightYellow"
          >
              <img
                src="/Home.png"
                alt="home icon"
                style={{ width: "1.5em", height: "1.5em" }}
              />
              <p className="font-semibold text-base text-black">Home Feed</p>
        </Link>
        <Link
            to="/explore"
            className="flex items-center p-2 rounded-xl bg-backgroundGrey gap-3 hover:bg-lightYellow"
            >
                <img
                  src="/Eye.png"
                  alt="eye icon"
                  style={{ width: "1.5em", height: "1.5em" }}
                />
                <p className="font-semibold text-base text-black">Explore Polls</p>
        </Link>
        <Link
            to="/create"
            className="flex items-center p-2 rounded-xl bg-backgroundGrey gap-3 hover:bg-lightYellow"
          >
              <img
                src="/Plus.png"
                alt="plus icon"
                style={{ width: "1.5em", height: "1.5em" }}
              />
              <p className="font-semibold text-base text-black">Create Post</p>
          </Link>
      </div>
    </div>
  );
}

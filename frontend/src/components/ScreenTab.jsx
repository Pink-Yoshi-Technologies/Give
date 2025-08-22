import React from "react";
import { Link } from "react-router-dom";

export default function ScreenTab({ onTabChange, activeTab }) {
  const row = (children, onClick, active = false) => (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className={
        "flex items-center p-2 rounded-xl gap-3 select-none cursor-pointer " +
        (active ? "bg-defaultYellow" : "bg-backgroundGrey hover:bg-lightYellow")
      }
    >
      {children}
    </div>
  );

  return (
    <div className="w-full rounded-xl">
      <div className="bg-backgroundGrey rounded-3xl p-4 flex flex-col gap-1.5">
        {/* Home Feed tab */}
        {row(
          <>
            <img src="/Home.png" alt="home icon" style={{ width: "1.5em", height: "1.5em" }} draggable={false} />
            <p className="font-semibold text-base text-black">Home Feed</p>
          </>,
          () => onTabChange("home"),
          activeTab === "home"
        )}
        {/* Explore Polls tab */}
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
        {/* Create Post tab */}
        {row(
          <>
            <img src="/Plus.png" alt="plus icon" style={{ width: "1.5em", height: "1.5em" }} draggable={false} />
            <p className="font-semibold text-base text-black">Create Post</p>
          </>,
          () => onTabChange("create"),
          activeTab === "create"
        )}
      </div>
    </div>
  );
}
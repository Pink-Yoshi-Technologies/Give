import React from "react";
import { UserInfo, ScreenTab } from "..";
import { Link, useLocation } from "react-router-dom";

// Pass whatever ScreenTab needs via screenTabProps
export default function LeftSideBar({ screenTabProps, extra }) {
  const location = useLocation();
  const isHome = location.pathname === "/home";
  return (
    <>
      <UserInfo />
      <ScreenTab {...screenTabProps} />
      {extra}
    </>
  );
}


import React from "react";
import { Link } from "react-router-dom";
import { homeTabConfig } from "../config/tabConfig";

/**
 * TabRow component represents a single tab in the ScreenTab.
 * Renders either a clickable div or a Link depending on the props.
 *
 * @param {Object} props - Component props
 * @param {string} props.icon - Path to the tab icon image
 * @param {string} props.label - Tab label text
 * @param {boolean} props.active - Whether the tab is currently active
 * @param {Function} [props.onClick] - Click handler for tab
 * @param {string} [props.link] - Link path for navigation
 */
export function TabRow({ icon, label, active, onClick, link }) {
  const content = (
    <div className="flex items-center gap-3">
      <img src={icon} alt={label + " icon"} style={{ width: "1.5em", height: "1.5em" }} />
      <p className="font-semibold text-base text-black">{label}</p>
    </div>
  );
  const className =
    "flex items-center p-2 rounded-xl select-none cursor-pointer " +
    (active ? "bg-defaultYellow" : "bg-backgroundGrey hover:bg-lightYellow");
  if (link) {
    return (
      <Link to={link} className={className}>
        {content}
      </Link>
    );
  }
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      className={className}
    >
      {content}
    </div>
  );
}

export default function ScreenTab({ tabConfig = homeTabConfig, onTabChange, onCurrentTab }) {
/**
 * ScreenTab component displays navigation tabs for the main app sections.
 * It highlights the active tab and handles tab changes via the onTabChange prop.
 *
 * @param {Object} props - Component props
 * @param {Array} props.tabConfig - Array of tab configuration objects
 * @param {Function} props.onTabChange - Callback for tab change
 * @param {string} props.onCurrentTab - The currently active tab
 */
  return (
    <div className="w-full rounded-xl">
      <div className="bg-backgroundGrey rounded-3xl p-4 flex flex-col gap-1.5">
        {tabConfig.map((tab) =>
          tab.link ? (
            <TabRow
              key={tab.label}
              icon={tab.icon}
              label={tab.label}
              link={tab.link}
              active={tab.activeKey && tab.activeKey === onCurrentTab}
            />
          ) : (
            <TabRow
              key={tab.label}
              icon={tab.icon}
              label={tab.label}
              active={tab.activeKey && tab.activeKey === onCurrentTab}
              onClick={() => tab.activeKey && onTabChange(tab.activeKey)}
            />
          )
        )}
      </div>
    </div>
  );
}


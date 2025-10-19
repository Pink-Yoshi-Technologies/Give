import React from "react";
import { NavBar } from "../";

/**
 * AppLayout component for the main application structure.
 *
 * Provides a three-column layout with a navigation bar at the top.
 * Renders left sidebar, center content, and right sidebar as provided by props.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.left - Content for the left sidebar.
 * @param {React.ReactNode} props.center - Main center content.
 * @param {React.ReactNode} props.right - Content for the right sidebar.
 * @returns {JSX.Element} The rendered application layout.
 */
export default function AppLayout({ left, center, right, layoutVariant = "default" }) {
  const equal = layoutVariant === "equal-columns";
  return (
    <div className="font-sans">
      <div className="h-screen flex flex-col overflow-hidden">
        <header className="shrink-0">
          <NavBar />
        </header>

        <main className="flex flex-1 min-h-0">
          <aside className={
            equal
              ? "flex flex-1 min-w-0 flex-col gap-4 max-h-screen overflow-y-auto scrollbar-hide"
              : "flex w-[27%] flex-col gap-4 sticky top-0 max-h-screen overflow-y-auto flex-shrink-0 scrollbar-hide"
          }>
            {left}
          </aside>

          <section className={
            equal
              ? "flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide px-2"
              : "flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide px-2"
          }>
            {center}
          </section>

          <aside className={
            equal
              ? "flex flex-1 min-w-0 flex-col gap-4 max-h-screen overflow-y-auto scrollbar-hide"
              : "flex w-[27%] flex-col gap-4 sticky top-0 max-h-screen flex-shrink-0 overflow-auto scrollbar-hide"
          }>
            {right}
          </aside>
        </main>
      </div>
    </div>
  );
}
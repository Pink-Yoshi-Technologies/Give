import React from "react";
import { Post, GroupTab, UserInfo, NavBar, ScreenTabGroup, GroupSearch } from "../";
import { useState, useMemo } from "react";

const Group = ({postData}) => {
  const id = new URLSearchParams(window.location.search).get('id');
  const [searchQuery, setSearchQuery] = useState("");
  
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
    };
  
    const handleSearchSubmit = (e) => {
      e.preventDefault();
      console.log("Search for:", searchQuery);
      // TODO: route to results page or trigger fetch here
    };


  // Hardcoded list for now; replace with fetched DB data later
  const posts = [
    {...postData}, 
    { ...postData, post: { ...postData.post, id: "p2", question: "Favourite movie snack?" } },
    { ...postData, post: { ...postData.post, id: "p3", question: "Dinner plans tonight?" } },
  ];

  console.log('postData: ', postData)


  return (
    <div className="font-sans">
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="shrink-0">
       <NavBar />
      </header>

      {/* min-h-0 lets children shrink and scroll correctly */}
      <main className="flex flex-1 min-h-0">
        {/* left column */}
        <aside className="flex w-[27%] flex-col gap-4 sticky top-0 max-h-screen flex-shrink-0">
          <UserInfo />
          <ScreenTabGroup />
          <div className="flex-1 overflow-y-hidden">
            <GroupTab id={id} />
          </div>
        </aside>

        {/* Centre column */}
        <section className="flex-1 min-w-0 flex flex-col gap-4 overflow-y-auto scrollbar-hide px-2">
          {posts.map((post) => (
            <Post
              key={post.id}
              user={postData.user}
              group={postData.group}
              post={postData.post}
              pollOptions={post.pollOptions}
            />
          ))}
        </section>

        {/* right column */}
        <aside className="flex w-[27%] flex-col sticky top-0 max-h-screen flex-shrink-0 scrollbar-groupSearch">
          <GroupSearch />
        </aside>
      </main>
    </div>
    </div>
  );
}

export default Group;

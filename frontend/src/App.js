import React,{ useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Post from './components/Post';
import './styles/App.css';
import GroupTab from './components/GroupTab';


async function getPostData () {
      try {
        const res = await fetch('http://localhost:5001/postData');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();  //
      } catch (err) {
        console.error('Failed to load poll:', err);
        return err.message; // Return error message for debugging
      }
    };

// npm install react-router-dom

function App() {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostData().then((data) => {
      setPostData(data);
  }).catch((error) => {
      console.error("Error fetching post data:", error);
    }).finally(() => {
      console.log("Post data fetch completed");
      setLoading(false);
    });
  }, []);

  if (loading) return <p>Loading...</p>;

  // return (
  //   <div className="App flex">
  //     {/* left column */}
  //     <GroupTab />

  //     {/* middle column */}
  //     <div className="flex-1 p-4">

  //       <main>
  //         <PollBox initialOptions={options} />
  //       </main>
  //     </div>
  //   </div>
  // );



  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </header>
      
      <div className="App flex">
      {/* left column */}
      <GroupTab />
      <div>

      {/* middle column */}
        <Post
          user={postData.user}
          group={postData.group}
          post={postData.post}
          pollOptions={postData.pollOptions}
        />

      </div>
    </div>
    </div>
  );

}
export default App;
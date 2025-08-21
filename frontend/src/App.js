import { useState, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
} from "react-router-dom";

import "./styles/App.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './components/RequireAuth';
import Group from "./pages/Group";

async function getPostData() {
  try {
    const res = await fetch("http://localhost:5001/postData");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error("Failed to load poll:", err);
    return err.message;
  }
}

// Layout for "app-styled" routes
function AppLayout({ postData }) {
  return (
    <div className="app">
      <Outlet context={{ postData }} />
    </div>
  );
}

function App() {
  const [postData, setPostData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPostData()
      .then((data) => setPostData(data))
      .catch((error) => console.error("Error fetching post data:", error))
      .finally(() => {
        console.log("Post data fetch completed");
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/create-account",
      element: <CreateAccount />,
    },
    {
      element: <AppLayout postData={postData} />,
      children: [
      {
        path: "/home",
        element: <RequireAuth><Home postData={postData} /></RequireAuth>,
      },
      {
        path: "/group",
        element: <Group postData={postData} />,
      },
    ],
    },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;

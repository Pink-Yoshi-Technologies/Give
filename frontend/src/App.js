/**
 * Main application entry point for the frontend React app.
 * Handles routing, authentication context, and post data fetching.
 */
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

/**
 * Fetch post data from the backend API.
 * @returns {Promise<Object>} Resolves to post data from the backend.
 */
export async function getPostData({
  limitCount = 10,
  orderByField = "createdAt",
  orderDirection = "desc",
} = {}) {
  const params = new URLSearchParams({
    limitCount,
    orderByField,
    orderDirection,
  });
  const res = await fetch(`/api/posts?${params.toString()}`);
  if (!res.ok) throw new Error((await res.json()).error || "Failed to fetch");
  return res.json();
}

/**
 * Layout component for app-styled routes.
 * Passes postData to child routes via Outlet context.
 * @param {Object} param.postData - The post data to provide to child routes.
 * @returns {JSX.Element}
 */
function AppLayout({ postData }) {
  return (
    <div className="app">
      <Outlet context={{ postData }} />
    </div>
  );
}

/**
 * Main App component. Sets up routing and fetches post data on mount.
 * @returns {JSX.Element}
 */
function App() {
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    getPostData()
      .then((data) => setPostData(data))
      .catch((error) => console.error("Error fetching post data:", error));
  }, []);

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
        element: <Home postData={postData} />,
      },
      {
        path: "/group",
        element: <RequireAuth><Group postData={postData} /></RequireAuth>,
      },
      {
        path: "/group/:groupId",
        element: <RequireAuth><Group /></RequireAuth>,
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

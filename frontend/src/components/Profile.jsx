import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

/**
 * Profile page component.
 * @returns {JSX.Element}
 */
const ProfilePage = () => {
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const user = auth.currentUser;

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!user) return;
      const postsRef = collection(db, "posts");
      const q = query(postsRef, where("authorId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      setPosts(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchUserPosts();
  }, [user, db]);

  if (!user) {
    return (
      <div className="text-center p-6">
        <h2 className="text-lg">Please log in to view your profile.</h2>
        <button
          className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-xl text-lg"
          onClick={() => navigate("/login")}
        >
          Go to Login
        </button>
      </div>
    );
  }

    return (
        <div className="p-8 bg-backgroundGrey rounded-2xl">
      {/* Profile Header */}
      <div className="flex items-center space-x-6">
        <img
          src={user.photoURL || "/images/noPfp.jpg"} // use project placeholder
          alt="Profile"
          className="w-28 h-28 rounded-full border-2 border-gray-300 object-cover" // larger and correctly scaled
        />
        <div>
          <h2 className="text-3xl font-bold">{user.displayName || "Anonymous User"}</h2>
          <p className="text-gray-600 text-lg">{user.email}</p>
        </div>
      </div>

      <hr className="my-8" />

      {/* User Posts */}
      <h3 className="text-2xl font-semibold mb-6">Your Posts</h3>
      {posts.length === 0 ? (
        <p className="text-gray-500 text-lg">You haven’t posted anything yet.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
                  className="p-6 rounded-xl hover:bg-lightYellow cursor-pointer"
              onClick={() => navigate(`/post/${post.id}`)}
            >
              <h4 className="font-bold text-lg">{post.title}</h4>
              <p className="text-gray-700 font-bold text-base">{post.content?.slice(0, 120)}...</p>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Button */}
      <button
                className="mt-8 px-6 py-3 bg-defaultYellow text-black rounded-xl text-lg font-semibold hover:bg-yellow-400 "
        onClick={() => alert("Edit Profile coming soon!")}
      >
        Edit Profile
      </button>
     </div>
  );
};

export default ProfilePage;

import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.error || "Login failed");

      setSuccess(result.message || "Logged in successfully");

      // navigate to home here
      // eg setTimeout(() => { navigate("/home");}, 2000);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex w-full h-screen bg-gray-100 font-[Nunito,Poppins,sans-serif]">
      <div className="w-[45%] flex justify-start items-center pl-[100px]">
        <div className="flex flex-col mb-[70px] ml-[25px] gap-1">
          <header>
            <h1 className="text-[#FFDD4A] text-[7rem] uppercase m-0 text-left">
              Give
            </h1>
          </header>
          <p className="text-[#ff9d00] text-2xl m-0 text-left">
            Can't decide? Let them vote.
          </p>
        </div>
      </div>

      <div className="w-[45%] flex justify-center items-center">
        <div className="bg-white p-8 rounded-xl shadow-md w-[600px] flex flex-col gap-4 ml-12">
          <input
            type="email"
            placeholder="Email"
            className="bg-pink-50 text-black px-4 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-pink-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="bg-pink-50 text-black px-4 py-3 border border-gray-300 rounded-lg text-base outline-none focus:border-pink-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* success message for testing purposes, should navigate to homepage once complete*/}
          {success && <p className="text-green-500 text-sm">{success}</p>}

          <button
            className="bg-pink-200 text-white py-3 rounded-lg text-lg hover:bg-pink-400 transition-colors"
            onClick={handleLogin}
          >
            Log In
          </button>
          <button className="border-none text-gray-500 text-sm underline pb-2 self-center hover:text-black">
            Forgot Account?
          </button>
          <button className="bg-[#FFDD4A] text-white py-3 rounded-lg text-lg hover:bg-[#d2b122] transition-colors"
            onClick={() => {
              // navigate to signup page
            }}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

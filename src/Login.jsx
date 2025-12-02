import React, { useRef, useState } from "react";
import { useAuth } from "./contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { NavBar } from "./Globals";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate(from, { replace: true });
    } catch (err) {
      setError("Failed to log in: " + err.message);
    }

    setLoading(false);
  }

  return (
    <div className="flex flex-col text-sl-title h-screen bg-sl-background">
      <NavBar />
      <div className="flex flex-col items-center justify-center h-full px-4">
        <div className="w-full max-w-md p-6 md:p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center mb-6">Log In</h2>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" ref={emailRef} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" ref={passwordRef} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border" />
            </div>
            <button disabled={loading} type="submit" className="w-full bg-sl-orange text-white font-bold py-2 px-4 rounded hover:bg-orange-600 transition duration-200">
              Log In
            </button>
          </form>
          <div className="w-100 text-center mt-4">
            Need an account? <Link to="/signup" className="text-sl-orange hover:underline">Sign Up</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

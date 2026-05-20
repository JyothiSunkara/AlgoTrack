import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function Header({ setIsOpen }) {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await API.get("/auth/me");

      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const username = user?.name || "User";

  const initials = username
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem("token");

    window.location.href = "/";
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-gray-800 px-4 md:px-6 py-4 flex items-center justify-between border-b border-gray-700 relative">
      {/* Left */}
      <div className="flex items-center gap-4">
        {/* Hamburger */}
        <button onClick={() => setIsOpen(true)} className="text-2xl md:hidden">
          ☰
        </button>

        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold">DSA Tracker</h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-8">
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/dashboard" className="hover:text-blue-400 transition">
            Dashboard
          </Link>

          <Link to="/problems" className="hover:text-blue-400 transition">
            Problems
          </Link>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 transition flex items-center justify-center font-semibold text-white"
          >
            {initials}
          </button>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-64 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-5 z-50">
              <div className="mb-5">
                <div className="mb-3">
                  <p className="text-sm text-gray-400">Name</p>
                  <p className="text-white font-semibold">{user?.name}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-white break-all">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-xl transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;

import { Link } from "react-router-dom";

function Sidebar({ isOpen, setIsOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed md:static top-0 left-0 min-h-screen w-64 bg-gray-800 p-5 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Mobile Header */}
        <div className="flex justify-between items-center mb-8 md:hidden">
          <h1 className="text-xl font-bold">DSA Tracker</h1>

          <button onClick={() => setIsOpen(false)}>✕</button>
        </div>

        {/* Desktop Title */}
        <h1 className="text-2xl font-bold mb-10 hidden md:block">
          DSA Tracker
        </h1>

        {/* Navigation */}
        <nav className="flex flex-col gap-5">
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-400"
          >
            Dashboard
          </Link>

          <Link
            to="/problems"
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-400"
          >
            Problems
          </Link>

          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="hover:text-blue-400"
          >
            Profile
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/";
            }}
            className="text-left text-red-400 hover:text-red-500 mt-5"
          >
            Logout
          </button>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

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
          fixed top-0 left-0 min-h-screen w-64 bg-gray-800 p-5 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Top Section */}
        <div className="flex items-center justify-between mb-10">
          {/* Title */}
          <h1 className="text-2xl font-bold">DSA Tracker</h1>
          {/* Mobile Close */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-xl"
          >
            ✕
          </button>
        </div>

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
        </nav>
      </div>
    </>
  );
}

export default Sidebar;

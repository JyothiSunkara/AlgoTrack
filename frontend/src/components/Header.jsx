function Header({ setIsOpen }) {
  return (
    <div className="md:hidden bg-gray-800 p-4 flex items-center">
      <button onClick={() => setIsOpen(true)} className="text-2xl">
        ☰
      </button>

      <h1 className="ml-4 text-lg font-semibold">DSA Tracker</h1>
    </div>
  );
}

export default Header;

import React from "react";

function StatCard({ title, value, icon, color }) {
  return (
    <div
      className="
        bg-gray-800
        rounded-2xl
        p-5
        shadow-lg
        border border-gray-700
        hover:border-gray-600
        hover:-translate-y-1
        transition-all duration-300
      "
    >
      {/* Top */}
      <div className="flex items-center justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
        >
          {icon}
        </div>
      </div>

      {/* Content */}
      <div>
        <p className="text-gray-400 text-sm">{title}</p>

        <h2 className="text-3xl font-bold mt-1">{value}</h2>
      </div>
    </div>
  );
}

export default StatCard;

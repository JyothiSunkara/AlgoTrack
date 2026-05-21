import { useEffect, useState } from "react";
import API, { getRecommendation } from "../services/api";
import StatCard from "../components/StatCard";
import {
  FiExternalLink,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";

function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [recommendedProblem, setRecommendedProblem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    try {
      const problemsRes = await API.get("/problems/");
      setProblems(problemsRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendedProblem = async () => {
    try {
      const response = await getRecommendation();

      setRecommendedProblem(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Stats
  const totalProblems = problems.length;

  const solvedProblems = problems.filter((problem) => problem.is_solved).length;

  const unsolvedProblems = totalProblems - solvedProblems;

  const completionRate =
    totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

  // Difficulty Counts
  const easyCount = problems.filter(
    (problem) => problem.difficulty === "Easy",
  ).length;

  const mediumCount = problems.filter(
    (problem) => problem.difficulty === "Medium",
  ).length;

  const hardCount = problems.filter(
    (problem) => problem.difficulty === "Hard",
  ).length;

  if (loading) {
    return (
      <div className="p-4 md:p-6 bg-gray-900 min-h-screen">
        <div className="animate-pulse flex flex-col gap-6">
          <div className="h-10 bg-gray-800 rounded-xl w-48" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="h-28 bg-gray-800 rounded-2xl" />
            ))}
          </div>

          <div className="h-52 bg-gray-800 rounded-2xl" />

          <div className="h-72 bg-gray-800 rounded-2xl" />

          <div className="h-48 bg-gray-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-gray-400 mt-1">Track your coding progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Problems"
          value={totalProblems}
          icon={<FiBookOpen size={22} />}
          color="bg-blue-500/20 text-blue-400"
        />

        <StatCard
          title="Solved"
          value={solvedProblems}
          icon={<FiCheckCircle size={22} />}
          color="bg-green-500/20 text-green-400"
        />

        <StatCard
          title="Unsolved"
          value={unsolvedProblems}
          icon={<FiClock size={22} />}
          color="bg-yellow-500/20 text-yellow-400"
        />

        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<FiTrendingUp size={22} />}
          color="bg-purple-500/20 text-purple-400"
        />
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8 shadow-lg border border-gray-700">
        <h2 className="text-xl font-semibold mb-6">Difficulty Breakdown</h2>

        <div className="flex flex-col gap-6">
          {/* Easy */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-green-400 font-medium">Easy</span>
              <span>{easyCount}</span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalProblems > 0 ? (easyCount / totalProblems) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Medium */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-yellow-400 font-medium">Medium</span>
              <span>{mediumCount}</span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalProblems > 0 ? (mediumCount / totalProblems) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Hard */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-red-400 font-medium">Hard</span>
              <span>{hardCount}</span>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-red-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalProblems > 0 ? (hardCount / totalProblems) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8 border border-gray-700 shadow-lg">
        <h2 className="text-xl font-semibold mb-5">Recent Problems</h2>

        {problems.length === 0 ? (
          <p className="text-gray-400">No problems added yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {problems.slice(0, 5).map((problem) => (
              <div
                key={problem.id}
                className="
                  flex items-center justify-between
                bg-gray-700/70
                  border border-gray-600
                  rounded-xl
                  p-4
                hover:border-gray-500
                  transition-all
                "
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      problem.is_solved ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />

                  <p>{problem.title}</p>
                </div>

                <div className="flex items-center gap-3">
                  <a
                    href={problem.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <FiExternalLink size={18} />
                  </a>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      problem.difficulty === "Easy"
                        ? "bg-green-500/20 text-green-400"
                        : problem.difficulty === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommendation Widget */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-lg">
        {" "}
        <h2 className="text-xl font-semibold mb-5">Problem Recommendation</h2>
        <p className="text-gray-400 mb-5">Not sure what to solve next?</p>
        <button
          onClick={getRecommendedProblem}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition"
        >
          Recommend Me a Problem
        </button>
        {recommendedProblem && (
          <div
            className="
              mt-6
            bg-gray-700/70
              border border-gray-600
              rounded-2xl
              p-5
            hover:border-gray-500
              transition-all
            "
          >
            {" "}
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Left */}
              <div>
                <h3 className="text-lg font-semibold">
                  {recommendedProblem.title}
                </h3>

                <p
                  className={`mt-2 text-sm ${
                    recommendedProblem.difficulty === "Easy"
                      ? "text-green-400"
                      : recommendedProblem.difficulty === "Medium"
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                >
                  {recommendedProblem.difficulty}
                </p>
              </div>

              {/* Right */}
              <a
                href={recommendedProblem.link}
                target="_blank"
                rel="noreferrer"
                className="
                bg-blue-600 hover:bg-blue-700
                  px-5 py-2.5
                  rounded-xl
                  font-medium
                  transition-all
                  hover:scale-105
                "
              >
                Solve Now
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

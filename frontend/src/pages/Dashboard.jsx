import { useEffect, useState } from "react";
import API, { getRecommendation } from "../services/api";
import StatCard from "../components/StatCard";
import { FiExternalLink } from "react-icons/fi";

function Dashboard() {
  const [problems, setProblems] = useState([]);
  const [recommendedProblem, setRecommendedProblem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const problemsRes = await API.get("/problems/");
      setProblems(problemsRes.data);
    } catch (error) {
      console.error(error);
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

  return (
    <div className="p-4 md:p-6 bg-gray-900 min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-gray-400 mt-1">Track your coding progress</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Problems" value={totalProblems} />

        <StatCard title="Solved" value={solvedProblems} />

        <StatCard title="Unsolved" value={unsolvedProblems} />

        <StatCard title="Completion Rate" value={`${completionRate}%`} />
      </div>

      {/* Difficulty Breakdown */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-5">Difficulty Breakdown</h2>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-green-400">Easy</span>

            <span>{easyCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-yellow-400">Medium</span>

            <span>{mediumCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-red-400">Hard</span>

            <span>{hardCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Problems */}
      <div className="bg-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-5">Recent Problems</h2>

        {problems.length === 0 ? (
          <p className="text-gray-400">No problems added yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {problems.slice(0, 5).map((problem) => (
              <div
                key={problem.id}
                className="flex items-center justify-between bg-gray-700 rounded-xl p-4"
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
                    className={`text-sm ${
                      problem.difficulty === "Easy"
                        ? "text-green-400"
                        : problem.difficulty === "Medium"
                          ? "text-yellow-400"
                          : "text-red-400"
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
      <div className="bg-gray-800 rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-5">Problem Recommendation</h2>

        <p className="text-gray-400 mb-5">Not sure what to solve next?</p>

        <button
          onClick={getRecommendedProblem}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-semibold transition"
        >
          Recommend Me a Problem
        </button>

        {recommendedProblem && (
          <div className="mt-6 bg-gray-700 rounded-2xl p-5">
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
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl transition"
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

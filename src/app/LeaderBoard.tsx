import useAPI from "@/hooks/useAPI";
import { getLeaderboard } from "./api/QuestionService";

export default function LeaderBoard() {
  const leaderboard = useAPI<any[]>(
    () => {
      return getLeaderboard();
    },
    { fetchOnMount: true }
  );

  return (
    <div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Leaderboard
        </h2>
        {leaderboard.loading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
        {leaderboard.error && (
          <div className="text-red-600">Failed to load leaderboard</div>
        )}
        {leaderboard.data && (
          <div className="bg-white rounded-lg shadow-md">
            <div className="divide-y divide-gray-200">
              {leaderboard.data.map((entry, index) => (
                <div
                  key={entry.solved_by}
                  className="flex items-center justify-between p-4 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex items-center justify-center w-8 h-8 rounded-full 
                    ${
                      index === 0
                        ? "bg-yellow-100 text-yellow-800"
                        : index === 1
                        ? "bg-gray-100 text-gray-800"
                        : index === 2
                        ? "bg-orange-100 text-orange-800"
                        : "bg-blue-50 text-blue-800"
                    } font-semibold`}
                    >
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900">
                      {entry.solved_by}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      {entry._count.solved_by}
                    </span>
                    <span className="text-sm text-gray-500">solved</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

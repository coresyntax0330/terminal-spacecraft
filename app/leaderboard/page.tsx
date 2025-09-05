"use client";

const leaderboardData = [
  { rank: 1, address: "0xA3F9cE14b7D27e9F0c1bC82a94562D7f3bE41c8B", power: "3,000" },
  { rank: 2, address: "0x9b2D6E4fF83c7a11f2Ac1E763e89A4Bc9712f56", power: "3,000" },
  { rank: 3, address: "0x71f38Ec814B92Fd0bC4A9F62A3E51aB877d5c31E", power: "3,000" },
  { rank: 4, address: "0x4aC27fd9b8c31C72Eb864A3BF29d5F7D6E34d012", power: "3,000" },
  { rank: 5, address: "0x1E98Bc4a72cF3f1dD8a65c91B2D0F7aA9F34b623", power: "3,000" },
  { rank: 6, address: "0x6D92e47A17C35d4BE916C820A3F7bE42f12a3F8C", power: "3,000" },
  { rank: 7, address: "0x8C74dF21a93E7E20B15b42c93d1F0d71B23cA9eE", power: "3,000" },
  { rank: 8, address: "0x5fA31E929d8b4C76E2D49a7C81a9F03D6e94bA18", power: "3,000" },
  { rank: 9, address: "0xC9e24BF71d4c59a1832a3Ef16d71F42a2D8c731", power: "3,000" },
  { rank: 10, address: "0x7B3f6cD914Ec34d5F90882a3f6C71aD8e91f4b2", power: "3,000" },
];

export default function Leaderboard() {
  return (
    <div className="h-full w-full text-green-400 font-mono flex flex-col">
      {/* Container */}
      <div className="border border-green-400 border-dashed p-6 flex flex-col gap-4 flex-1">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl">LEADERBOARD</h1>
          <span className="cursor-pointer">[ X ]</span>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto text-sm">
          {leaderboardData.map((item) => (
            <div
              key={item.rank}
              className="flex justify-between border-b border-green-900 py-1"
            >
              <span>#{item.rank}</span>
              <span className="truncate w-[360px]">{item.address}</span>
              <span>{item.power} FLEET POWER</span>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 text-sm mt-2">
          <button>&lt;</button>
          {[1, 2, 3, 4, "...", 10].map((p, i) => (
            <button
              key={i}
              className="px-1 hover:bg-green-400 hover:text-black transition"
            >
              {p}
            </button>
          ))}
          <button>&gt;</button>
        </div>
      </div>
    </div>
  );
}

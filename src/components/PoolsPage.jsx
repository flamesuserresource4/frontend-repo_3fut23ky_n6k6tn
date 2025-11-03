import React from 'react';

const mockPairs = [
  { id: 'ETH/USDC', tvl: 1234567, fee: 0.3, yourLp: 12.34 },
  { id: 'ETH/DAI', tvl: 654321, fee: 0.3, yourLp: 0.0 },
  { id: 'TKNA/TKNB', tvl: 10234, fee: 0.3, yourLp: 3.21 },
];

function formatUSD(n) {
  return '$' + Number(n).toLocaleString();
}

export default function PoolsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto bg-gray-900/60 border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold text-lg">Pools</h2>
        <div className="text-xs text-white/60">Factory: 3 pairs</div>
      </div>
      <div className="divide-y divide-white/10">
        {mockPairs.map((p) => (
          <div key={p.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="text-white font-medium">{p.id}</div>
              <div className="text-xs text-white/60">Fee {p.fee}% · TVL {formatUSD(p.tvl)}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-white/80 text-sm">Your LP: {p.yourLp}</div>
              <button className="px-3 py-2 rounded-md bg-white/10 text-white text-sm hover:bg-white/20">Add</button>
              <button className="px-3 py-2 rounded-md bg-white text-gray-900 text-sm hover:bg-gray-100">Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

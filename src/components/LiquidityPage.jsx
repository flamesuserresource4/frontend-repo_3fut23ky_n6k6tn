import React, { useMemo, useState } from 'react';
import TokenSelectorModal from './TokenSelectorModal';

const defaultTokens = [
  { symbol: 'ETH', name: 'Ether', address: '' },
  { symbol: 'USDC', name: 'USD Coin', address: '' },
  { symbol: 'DAI', name: 'Dai Stablecoin', address: '' },
  { symbol: 'TKNA', name: 'Token A', address: '' },
  { symbol: 'TKNB', name: 'Token B', address: '' },
];

function format(n) {
  if (!isFinite(n)) return '0';
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export default function LiquidityPage({ mode = 'add' }) {
  const [tab, setTab] = useState(mode); // 'add' | 'remove'
  const [isSelecting, setIsSelecting] = useState(null);
  const [tokens] = useState(defaultTokens);

  const [tokenA, setTokenA] = useState(tokens[0]);
  const [tokenB, setTokenB] = useState(tokens[1]);
  const [amtA, setAmtA] = useState('');
  const [amtB, setAmtB] = useState('');
  const [lpAmt, setLpAmt] = useState('');
  const [loading, setLoading] = useState(false);

  const reserves = { A: 1000, B: 1000 }; // mock equal reserves

  const suggestedB = useMemo(() => {
    const a = Number(amtA);
    if (!a) return '';
    // Keep ratio based on reserves
    const ratio = reserves.B / reserves.A;
    return (a * ratio).toString();
  }, [amtA]);

  const previewRemove = useMemo(() => {
    const lp = Number(lpAmt);
    if (!lp) return { a: 0, b: 0 };
    const totalLp = 1000; // mock total liquidity tokens
    const share = lp / totalLp;
    return { a: reserves.A * share, b: reserves.B * share };
  }, [lpAmt]);

  function handleSelect(t) {
    if (isSelecting === 'A') setTokenA(t);
    if (isSelecting === 'B') setTokenB(t);
  }

  async function submitAdd() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    alert('Liquidity supplied! You received 12.34 LP');
    setAmtA('');
    setAmtB('');
  }

  async function submitRemove() {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    alert('Liquidity removed!');
    setLpAmt('');
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-gray-900/60 border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => setTab('add')}
          className={`px-4 py-2 rounded-md text-sm ${tab === 'add' ? 'bg-white text-gray-900' : 'bg-white/10 text-white'}`}
        >
          Add Liquidity
        </button>
        <button
          onClick={() => setTab('remove')}
          className={`px-4 py-2 rounded-md text-sm ${tab === 'remove' ? 'bg-white text-gray-900' : 'bg-white/10 text-white'}`}
        >
          Remove Liquidity
        </button>
      </div>

      {tab === 'add' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setIsSelecting('A')} className="bg-white/10 hover:bg.White/20 text-white px-3 py-2 rounded-md">
                {tokenA.symbol} ▼
              </button>
              <div className="text-xs text-white/60">Balance: 0.00</div>
            </div>
            <input
              value={amtA}
              onChange={(e) => setAmtA(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl text-white outline-none"
            />
          </div>

          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <button onClick={() => setIsSelecting('B')} className="bg-white/10 hover:bg.White/20 text-white px-3 py-2 rounded-md">
                {tokenB.symbol} ▼
              </button>
              <div className="text-xs text-white/60">Balance: 0.00</div>
            </div>
            <input
              value={amtB || suggestedB}
              onChange={(e) => setAmtB(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl text-white outline-none"
            />
            {amtA && !amtB && (
              <div className="text-xs text-white/50 mt-1">Suggested: {format(Number(suggestedB))}</div>
            )}
          </div>

          <div className="md:col-span-2">
            <button
              disabled={!amtA || !(amtB || suggestedB) || loading}
              onClick={submitAdd}
              className="w-full py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 disabled:opacity-50"
            >
              {loading ? 'Supplying...' : 'Supply'}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/80 text-sm mb-2">LP Amount</div>
            <input
              value={lpAmt}
              onChange={(e) => setLpAmt(e.target.value)}
              placeholder="0.0"
              className="w-full bg-transparent text-2xl text-white outline-none"
            />
          </div>
          <div className="bg-white/5 rounded-xl p-3">
            <div className="text-white/80 text-sm mb-2">You will receive</div>
            <div className="text-white/90">{format(previewRemove.a)} {tokenA.symbol} + {format(previewRemove.b)} {tokenB.symbol}</div>
          </div>
          <button
            disabled={!lpAmt || loading}
            onClick={submitRemove}
            className="w-full py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 disabled:opacity-50"
          >
            {loading ? 'Removing...' : 'Remove'}
          </button>
        </div>
      )}

      <TokenSelectorModal
        isOpen={!!isSelecting}
        onClose={() => setIsSelecting(null)}
        onSelect={handleSelect}
        tokens={tokens}
      />
    </div>
  );
}

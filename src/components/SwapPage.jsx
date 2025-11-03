import React, { useMemo, useState } from 'react';
import TokenSelectorModal from './TokenSelectorModal';

const defaultTokens = [
  { symbol: 'ETH', name: 'Ether', address: '' },
  { symbol: 'USDC', name: 'USD Coin', address: '' },
  { symbol: 'DAI', name: 'Dai Stablecoin', address: '' },
  { symbol: 'TKNA', name: 'Token A', address: '' },
  { symbol: 'TKNB', name: 'Token B', address: '' },
];

const mockPrices = {
  ETH: 3000,
  USDC: 1,
  DAI: 1,
  TKNA: 2,
  TKNB: 0.5,
};

function format(n) {
  if (!isFinite(n)) return '0';
  return Number(n).toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export default function SwapPage() {
  const [isSelecting, setIsSelecting] = useState(null); // 'from' | 'to' | null
  const [tokens, setTokens] = useState(defaultTokens);

  const [fromToken, setFromToken] = useState(tokens[0]);
  const [toToken, setToToken] = useState(tokens[1]);
  const [amountIn, setAmountIn] = useState('');
  const [slippage, setSlippage] = useState(0.5);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const amountOut = useMemo(() => {
    const aIn = Number(amountIn);
    if (!aIn || !mockPrices[fromToken.symbol] || !mockPrices[toToken.symbol]) return 0;
    const usd = aIn * mockPrices[fromToken.symbol];
    const out = usd / mockPrices[toToken.symbol];
    // Apply 0.3% fee simulation
    return out * 0.997;
  }, [amountIn, fromToken, toToken]);

  function handleSelect(t) {
    if (isSelecting === 'from') setFromToken(t);
    if (isSelecting === 'to') setToToken(t);
  }

  async function submitSwap() {
    try {
      setLoading(true);
      setMessage('Checking allowance and preparing swap...');
      await new Promise((r) => setTimeout(r, 700));
      setMessage('Submitting transaction...');
      await new Promise((r) => setTimeout(r, 900));
      setMessage('Waiting for confirmation...');
      await new Promise((r) => setTimeout(r, 1200));
      setMessage('');
      setAmountIn('');
      alert('Swap confirmed!');
    } catch (e) {
      alert('Swap failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-gray-900/60 border border-white/10 rounded-2xl p-4 shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-white font-semibold text-lg">Swap</h2>
        <div className="text-xs text-white/60">Slippage</div>
      </div>

      <div className="space-y-3">
        <div className="bg-white/5 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setIsSelecting('from')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md"
            >
              {fromToken.symbol}
              <span className="text-white/60 text-xs">▼</span>
            </button>
            <div className="text-xs text-white/50">Balance: 0.00</div>
          </div>
          <input
            value={amountIn}
            onChange={(e) => setAmountIn(e.target.value)}
            placeholder="0.0"
            className="w-full bg-transparent text-3xl text-white outline-none"
          />
        </div>

        <div className="text-center text-white/50">↓</div>

        <div className="bg-white/5 rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setIsSelecting('to')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded-md"
            >
              {toToken.symbol}
              <span className="text-white/60 text-xs">▼</span>
            </button>
            <div className="text-xs text-white/50">Balance: 0.00</div>
          </div>
          <div className="w-full text-3xl text-white/80 min-h-[2.5rem]">
            {format(amountOut)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {[
            { v: 0.5, label: '0.5%' },
            { v: 1, label: '1%' },
          ].map((s) => (
            <button
              key={s.v}
              onClick={() => setSlippage(s.v)}
              className={`px-3 py-1.5 rounded-md text-xs ${slippage === s.v ? 'bg-white text-gray-900' : 'bg-white/10 text-white'}`}
            >
              {s.label}
            </button>
          ))}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-white/60">Custom</span>
            <input
              type="number"
              min="0"
              step="0.1"
              value={slippage}
              onChange={(e) => setSlippage(Number(e.target.value))}
              className="w-20 bg-white/5 border border-white/10 rounded-md px-2 py-1 text-xs text-white"
            />
            <span className="text-xs text-white/60">%</span>
          </div>
        </div>

        <button
          disabled={!amountIn || loading}
          onClick={submitSwap}
          className="w-full py-3 rounded-xl bg-white text-gray-900 font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Swapping...' : 'Swap'}
        </button>

        {message && (
          <div className="text-center text-xs text-white/70">{message}</div>
        )}
      </div>

      <TokenSelectorModal
        isOpen={!!isSelecting}
        onClose={() => setIsSelecting(null)}
        onSelect={handleSelect}
        tokens={tokens}
      />
    </div>
  );
}

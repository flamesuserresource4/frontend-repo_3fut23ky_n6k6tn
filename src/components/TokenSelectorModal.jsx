import React, { useMemo, useState } from 'react';

export default function TokenSelectorModal({ isOpen, onClose, onSelect, tokens }) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tokens;
    return tokens.filter((t) =>
      t.symbol.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      (t.address && t.address.toLowerCase().includes(q))
    );
  }, [query, tokens]);

  const [customAddr, setCustomAddr] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold">Select a token</h3>
          <button className="text-white/60 hover:text-white" onClick={onClose}>✕</button>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or paste address"
          className="w-full rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm mb-3 placeholder-white/40"
        />

        <div className="max-h-64 overflow-auto space-y-1">
          {filtered.map((t) => (
            <button
              key={t.address || t.symbol}
              onClick={() => {
                onSelect(t);
                onClose();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-white/5 text-left"
            >
              <div>
                <div className="text-white font-medium">{t.symbol}</div>
                <div className="text-xs text-white/60">{t.name}</div>
              </div>
              {t.address && (
                <div className="text-[10px] text-white/40">{t.address.slice(0, 8)}...{t.address.slice(-6)}</div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-white/10 pt-3">
          <div className="text-white/70 text-xs mb-2">Custom token address</div>
          <div className="flex gap-2">
            <input
              value={customAddr}
              onChange={(e) => setCustomAddr(e.target.value)}
              placeholder="0x..."
              className="flex-1 rounded-md bg-white/5 border border-white/10 text-white px-3 py-2 text-sm placeholder-white/40"
            />
            <button
              className="px-3 py-2 rounded-md bg-white text-gray-900 text-sm font-medium"
              onClick={() => {
                if (!customAddr || customAddr.length < 10) return;
                onSelect({ symbol: 'CUSTOM', name: 'Custom Token', address: customAddr });
                onClose();
              }}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Wallet } from 'lucide-react';

function shortenAddress(addr) {
  if (!addr) return '';
  return addr.slice(0, 6) + '...' + addr.slice(-4);
}

const networks = [
  { id: 31337, name: 'Hardhat' },
  { id: 11155111, name: 'Sepolia' },
];

export default function Navbar({ active, onNavigate, wallet, onConnectToggle, networkId, onChangeNetwork }) {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-white/10 backdrop-blur bg-black/40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-400" />
          <div className="text-white font-semibold text-lg">VibeSwap</div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {[
            { key: 'swap', label: 'Swap' },
            { key: 'add', label: 'Add Liquidity' },
            { key: 'remove', label: 'Remove Liquidity' },
            { key: 'pools', label: 'Pools' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`px-4 py-2 rounded-md text-sm transition ${
                active === item.key
                  ? 'bg-white/10 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <select
            value={networkId}
            onChange={(e) => onChangeNetwork(Number(e.target.value))}
            className="bg-white/5 border border-white/10 text-white text-sm rounded-md px-2 py-2"
            aria-label="Select network"
          >
            {networks.map((n) => (
              <option key={n.id} value={n.id} className="bg-gray-900">
                {n.name}
              </option>
            ))}
          </select>

          <button
            onClick={onConnectToggle}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-white text-gray-900 text-sm font-medium hover:bg-gray-100 transition"
          >
            <Wallet className="w-4 h-4" />
            {wallet.connected ? (
              <span>
                {shortenAddress(wallet.address)} · {wallet.balance} ETH
              </span>
            ) : (
              <span>Connect Wallet</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

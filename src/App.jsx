import React, { useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import SwapPage from './components/SwapPage';
import LiquidityPage from './components/LiquidityPage';
import PoolsPage from './components/PoolsPage';

function randomAddress() {
  const hex = Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
  return '0x' + hex;
}

export default function App() {
  const [active, setActive] = useState('swap'); // swap | add | remove | pools
  const [networkId, setNetworkId] = useState(31337);
  const [wallet, setWallet] = useState({ connected: false, address: '', balance: '0.00' });

  function toggleWallet() {
    if (wallet.connected) {
      setWallet({ connected: false, address: '', balance: '0.00' });
    } else {
      setWallet({ connected: true, address: randomAddress(), balance: (Math.random() * 3 + 0.1).toFixed(4) });
    }
  }

  const gradient = useMemo(() => {
    return networkId === 31337
      ? 'from-gray-900 via-purple-900 to-black'
      : 'from-indigo-900 via-blue-900 to-black';
  }, [networkId]);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} text-white`}> 
      <Navbar
        active={active}
        onNavigate={setActive}
        wallet={wallet}
        onConnectToggle={toggleWallet}
        networkId={networkId}
        onChangeNetwork={setNetworkId}
      />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-[1.2fr] gap-6">
          {active === 'swap' && <SwapPage />}
          {active === 'add' && <LiquidityPage mode="add" />}
          {active === 'remove' && <LiquidityPage mode="remove" />}
          {active === 'pools' && <PoolsPage />}
        </div>

        <footer className="mt-10 text-center text-white/50 text-xs">
          This is a visual prototype of a Uniswap V2-style DEX front-end. Connect to your smart contracts and wallet libraries to enable on-chain functionality.
        </footer>
      </main>
    </div>
  );
}

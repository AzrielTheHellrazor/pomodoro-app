"use client";
import { useEffect } from "react";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import Timer from "@/components/Timer";
import Tasks from "@/components/Tasks";

export default function Home() {
  // MiniKit setup - required for the mini app to function properly
  const { setMiniAppReady, isMiniAppReady } = useMiniKit();
  
  // Wallet connection - get connected wallet address/ENS
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (!isMiniAppReady) {
      setMiniAppReady();
    }
  }, [setMiniAppReady, isMiniAppReady]);

  // Format wallet address for display (show first 6 and last 4 characters)
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      {/* Header with wallet connection */}
      <header className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          Pomodoro Timer
        </h1>
        <div className="flex items-center gap-3">
          {/* Display connected wallet address if connected */}
          {isConnected && address && (
            <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {formatAddress(address)}
            </div>
          )}
          {/* Wallet connection button from OnchainKit */}
          <Wallet />
        </div>
      </header>

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Timer component - handles countdown logic and controls */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Timer />
          </div>

          {/* Tasks component - handles task management with localStorage */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <Tasks />
          </div>
        </div>
      </main>
    </div>
  );
}

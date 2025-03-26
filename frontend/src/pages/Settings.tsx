import React, { useState } from "react";

const Settings = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [copyTradingSize, setCopyTradingSize] = useState(0.1); // Default starting size
  const [takeProfit, setTakeProfit] = useState(0);
  const [customSize, setCustomSize] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Wallet Address:", walletAddress);
    console.log("Copy Trading Size:", copyTradingSize);
    console.log("Take Profit:", takeProfit);
  };

  return (
    <div className="p-6 bg-black min-h-screen">
      <h1 className="text-4xl font-bold text-blue-500 mb-6">Settings</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-6">
          <label className="block text-white" htmlFor="walletAddress">
            Wallet Address to Copy Trade:
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full p-3 border border-gray-300 rounded-lg text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-white" htmlFor="copyTradingSize">
            Standard Copy Trading Size:
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setCopyTradingSize(0.1)}
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              0.1 SOL
            </button>
            <button
              type="button"
              onClick={() => setCopyTradingSize(0.2)}
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              0.2 SOL
            </button>
            <button
              type="button"
              onClick={() => setCopyTradingSize(0.5)}
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              0.5 SOL
            </button>
            <input
              type="number"
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              placeholder="Custom Size"
              className="w-24 p-2 border border-gray-300 rounded-lg text-white"
            />
            <button
              type="button"
              onClick={() => setCopyTradingSize(Number(customSize) || 0.1)} // Default to 0.1 if invalid
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              Set Custom
            </button>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-white" htmlFor="takeProfit">
            Take Profit Amount:
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setTakeProfit(50)}
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => setTakeProfit(100)}
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              100%
            </button>
            <button
              type="button"
              onClick={() => setTakeProfit(300)}
              className="bg-white text-black px-4 py-2 rounded-lg"
            >
              300%
            </button>
            <input
              type="number"
              value={takeProfit}
              onChange={(e) => setTakeProfit(Number(e.target.value))}
              placeholder="Manual Amount"
              className="w-24 p-2 border border-gray-300 rounded-lg text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          className="bg-white text-black border border-gray-300 px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition mt-4"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;

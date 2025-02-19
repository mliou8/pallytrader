import React, { useState } from "react";

const Settings = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [copyTradingSize, setCopyTradingSize] = useState(0);
  const [takeProfit, setTakeProfit] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here, such as saving settings
    console.log("Wallet Address:", walletAddress);
    console.log("Copy Trading Size:", copyTradingSize);
    console.log("Take Profit:", takeProfit);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-black">Settings</h1>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="walletAddress">
            Wallet Address to Copy Trade:
          </label>
          <input
            type="text"
            id="walletAddress"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="Enter wallet address"
            className="w-full p-3 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="copyTradingSize">
            Standard Copy Trading Size:
          </label>
          <input
            type="number"
            id="copyTradingSize"
            value={copyTradingSize}
            onChange={(e) => setCopyTradingSize(Number(e.target.value))}
            placeholder="Enter trading size"
            className="w-full p-3 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="takeProfit">
            Take Profit Amount:
          </label>
          <input
            type="number"
            id="takeProfit"
            value={takeProfit}
            onChange={(e) => setTakeProfit(Number(e.target.value))}
            placeholder="Enter take profit amount"
            className="w-full p-3 border border-gray-300 rounded-lg text-black"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default Settings;

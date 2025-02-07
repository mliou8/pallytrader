import { useState, useEffect } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";

import { Copy, Download } from "lucide-react";
import '../index.css'

const Profile = () => {
  const [wallet, setWallet] = useState<{ address: string; secretKey: Uint8Array } | null>(null);

  useEffect(() => {
    // Check if a wallet already exists in local storage
    const savedWallet = localStorage.getItem("solana_wallet");
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    }
  }, []);

  // Generate a new Solana Wallet
  const createWallet = () => {
    const keypair = Keypair.generate();
    const newWallet = {
      address: keypair.publicKey.toBase58(),
      secretKey: new Uint8Array(keypair.secretKey), // Convert to Uint8Array
    };

    setWallet(newWallet);
    localStorage.setItem("solana_wallet", JSON.stringify(newWallet));
  };

  // Copy Wallet Address to Clipboard
  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      alert("Copied to clipboard!");
    }
  };

  // Export Private Key
  const downloadPrivateKey = () => {
    if (wallet) {
      const blob = new Blob([JSON.stringify(wallet.secretKey)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "solana_private_key.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="p-6 text-white">
      <div className="text-[24px] font-bold mb-4 text-black">Create/Import your Wallet</div>

      {wallet ? (
        <div className="homebg p-6 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-2">Solana Wallet</h2>
          <p className="text-gray-300 mb-2">
            <span className="font-semibold">Address:</span> {wallet.address}
          </p>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button onClick={copyToClipboard} className="bg-blue-600 text-black flex items-center">
              <Copy size={18} className="mr-2" />
              Copy Address
            </button>
            <button onClick={downloadPrivateKey} className="bg-yellow-500 text-black flex items-center">
              <Download size={18} className="mr-2" />
              Export Key
            </button>
          </div>
        </div>
      ) : (
        <button onClick={createWallet} className="bg-[#041541] text-white">
          Create Solana Wallet
        </button>
      )}
    </div>
  );
};

export default Profile;

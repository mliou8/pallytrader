import { useState, useEffect } from "react";
import { Keypair, PublicKey } from "@solana/web3.js";
import { Copy, Download } from "lucide-react";
import "../index.css";
import Positions from "./Positions";

const Profile = () => {
  const [wallet, setWallet] = useState<{
    address: string;
    secretKey: Uint8Array;
  } | null>(null);

  useEffect(() => {
    // Check if the wallet is saved in localStorage or already connected via browser extension (e.g., Phantom)
    const savedWallet = localStorage.getItem("solana_wallet");
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    } else if (window.solana) {
      // If a wallet extension is available, try connecting automatically
      window.solana
        .connect()
        .then((response) => {
          const walletAddress = response.publicKey.toBase58();
          const newWallet = {
            address: walletAddress,
            secretKey: [], // Cannot access the private key from wallet extension
          };
          setWallet(newWallet);
          localStorage.setItem("solana_wallet", JSON.stringify(newWallet));
        })
        .catch((error) => {
          console.log("Failed to auto-connect wallet:", error);
        });
    }
  }, []);

  const createWallet = () => {
    const keypair = Keypair.generate();
    const newWallet = {
      address: keypair.publicKey.toBase58(),
      secretKey: Array.from(keypair.secretKey),
    };

    setWallet(newWallet);
    localStorage.setItem("solana_wallet", JSON.stringify(newWallet));
  };

  const importWallet = () => {
    const privateKey = prompt("Paste your private key:");
    if (privateKey) {
      try {
        const secretKey = new Uint8Array(JSON.parse(privateKey));
        const keypair = Keypair.fromSecretKey(secretKey);
        const importedWallet = {
          address: keypair.publicKey.toBase58(),
          secretKey: Array.from(keypair.secretKey),
        };

        setWallet(importedWallet);
        localStorage.setItem("solana_wallet", JSON.stringify(importedWallet));
        alert("Wallet imported successfully!");
      } catch (error) {
        alert("Invalid private key format.");
      }
    }
  };

  const connectWallet = async () => {
    if (window.solana) {
      try {
        const response = await window.solana.connect();
        const walletAddress = response.publicKey.toBase58();
        const newWallet = {
          address: walletAddress,
          secretKey: [], // Cannot access the private key of the connected wallet
        };

        setWallet(newWallet);
        localStorage.setItem("solana_wallet", JSON.stringify(newWallet));
        alert("Wallet connected successfully!");
      } catch (error) {
        alert("Failed to connect wallet.");
      }
    } else {
      alert("Please install a Solana wallet extension like Phantom.");
    }
  };

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      alert("Copied to clipboard!");
    }
  };

  const downloadPrivateKey = () => {
    if (wallet) {
      const blob = new Blob([JSON.stringify(wallet.secretKey)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "solana_private_key.json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem("solana_wallet");
    setWallet(null);
  };

  return (
    <div className="p-6 text-white bg-[#111111] min-h-screen">
      {/* Top Right Buttons */}
      <div className="flex justify-end space-x-4 mb-8">
        {wallet ? (
          <button
            onClick={disconnectWallet}
            className="bg-gradient-to-r from-[#FF416C] to-[#FF4B2B] px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
          >
            Disconnect Wallet
          </button>
        ) : (
          <>
            <button
              onClick={connectWallet}
              className="bg-gradient-to-r from-[#6200EE] to-[#BB86FC] px-4 py-2 rounded-lg text-white hover:opacity-90 transition-opacity"
            >
              Connect Wallet
            </button>
            <button
              onClick={importWallet}
              className="bg-gradient-to-r from-[#03DAC6] to-[#00BFA5] px-4 py-2 rounded-lg text-black hover:opacity-90 transition-opacity"
            >
              Import Wallet
            </button>
          </>
        )}
      </div>
      <div className="p-6">
        {wallet ? (
          <div className="bg-gradient-to-r from-[#6200EE] to-[#BB86FC] p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl font-bold">Solana Wallet</h1>
            <p className="text-sm text-[#CCCCCC]">Address: {wallet.address}</p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={copyToClipboard}
                className="bg-gradient-to-r from-[#6200EE] to-[#BB86FC] text-white flex items-center px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Copy size={18} className="mr-2" />
                Copy Address
              </button>
              <button
                onClick={downloadPrivateKey}
                className="bg-gradient-to-r from-[#03DAC6] to-[#00BFA5] text-black flex items-center px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Download size={18} className="mr-2" />
                Export Key
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">No wallet connected.</p>
        )}
      </div>

      {/* Positions Component */}
      <Positions />
    </div>
  );
};

export default Profile;

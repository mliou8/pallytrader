import { useState, useEffect } from "react";
import {
  Keypair,
  PublicKey,
  Connection,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Copy, Download } from "lucide-react";
import "../index.css";
import Positions from "./Positions";

const Profile = () => {
  const [wallet, setWallet] = useState<{
    address: string;
    secretKey: Uint8Array;
  } | null>(null);
  const [tradingWallet, setTradingWallet] = useState("");
  const [copyTradingStatus, setCopyTradingStatus] = useState("Idle");
  const [error, setError] = useState("");
  const [connection] = useState(new Connection("https://api.devnet.solana.com"));

  useEffect(() => {
    const savedWallet = localStorage.getItem("solana_wallet");
    if (savedWallet) {
      setWallet(JSON.parse(savedWallet));
    } else if (window.solana) {
      window.solana
        .connect()
        .then((response) => {
          const walletAddress = response.publicKey.toBase58();
          const newWallet = {
            address: walletAddress,
            secretKey: [],
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
          secretKey: [],
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
    if (wallet && wallet.secretKey.length > 0) {
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
    } else {
      alert("No private key available to export (e.g., Phantom wallet).");
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem("solana_wallet");
    if (window.solana) window.solana.disconnect();
    setWallet(null);
    setTradingWallet("");
    setCopyTradingStatus("Idle");
    setError("");
  };

  const validateTradingWallet = (address: string) => {
    try {
      new PublicKey(address);
      return true;
    } catch (error) {
      return false;
    }
  };

  const startCopyTrading = async () => {
    if (!wallet) {
      setError("Please connect a wallet first.");
      return;
    }
    if (!validateTradingWallet(tradingWallet)) {
      setError("Invalid trading wallet address.");
      return;
    }
    if (wallet.secretKey.length === 0) {
      setError("Copy trading requires a generated or imported wallet with a private key.");
      return;
    }

    setCopyTradingStatus("Starting...");
    setError("");
    console.log("Starting copy trading for:", tradingWallet);

    const targetWallet = new PublicKey(tradingWallet);
    let lastSignature = null;

    const pollInterval = setInterval(async () => {
      try {
        console.log("Polling for new transactions...");
        const signatures = await connection.getSignaturesForAddress(targetWallet, { limit: 1 });
        const latestSignature = signatures[0]?.signature;

        if (latestSignature && latestSignature !== lastSignature) {
          console.log("New transaction detected:", latestSignature);
          setCopyTradingStatus("Monitoring...");
          lastSignature = latestSignature;

          const tx = await connection.getParsedTransaction(latestSignature, { maxSupportedTransactionVersion: 0 });
          console.log("Transaction details:", tx?.transaction?.message?.instructions);

          if (tx?.transaction?.message?.instructions) {
            const transferInstruction = tx.transaction.message.instructions.find(
              (instr) => instr.programId.toString() === SystemProgram.programId.toString()
            );

            if (transferInstruction?.parsed?.type === "transfer") {
              const { lamports, destination } = transferInstruction.parsed.info;
              setCopyTradingStatus(`Copying trade: ${lamports / LAMPORTS_PER_SOL} SOL to ${destination}`);
              console.log("Copying transfer:", lamports, "to", destination);

              const { blockhash } = await connection.getLatestBlockhash();
              const copyTx = new Transaction({
                recentBlockhash: blockhash,
                feePayer: new PublicKey(wallet.address),
              }).add(
                SystemProgram.transfer({
                  fromPubkey: new PublicKey(wallet.address),
                  toPubkey: new PublicKey(destination),
                  lamports,
                })
              );

              const keypair = Keypair.fromSecretKey(Uint8Array.from(wallet.secretKey));
              console.log("Sending automatically via Keypair...");
              const signature = await connection.sendTransaction(copyTx, [keypair]);

              console.log("Awaiting confirmation...");
              await connection.confirmTransaction(signature);
              setCopyTradingStatus(`Trade copied! Tx: ${signature}`);
              setError(`Successfully copied trade: ${signature}`);
            } else {
              console.log("No transfer instruction found in this tx.");
            }
          } else {
            console.log("No instructions found in transaction.");
          }
        } else {
          console.log("No new transactions yet.");
        }
      } catch (err) {
        console.error("Polling error:", err);
        setError("Failed to process trade.");
        setCopyTradingStatus("Error");
      }
    }, 5000);

    setError("Copy trading started! Polling target wallet...");
  };

  return (
    <div className="p-6 text-white bg-[#111111] min-h-screen">
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
            <button
              onClick={createWallet}
              className="bg-gradient-to-r from-[#03DAC6] to-[#00BFA5] px-4 py-2 rounded-lg text-black hover:opacity-90 transition-opacity"
            >
              Create Wallet
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

        {wallet && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Copy Trading</h2>
            <input
              type="text"
              placeholder="Enter wallet address to copy trades from"
              value={tradingWallet}
              onChange={(e) => setTradingWallet(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg text-black mb-4"
            />
            <button
              onClick={startCopyTrading}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition"
            >
              Start Copy Trading
            </button>
            <button
  onClick={async () => {
    try {
      const { blockhash } = await connection.getLatestBlockhash();
      const copyTx = new Transaction({
        recentBlockhash: blockhash,
        feePayer: new PublicKey(wallet.address),
      }).add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(wallet.address),
          toPubkey: new PublicKey("F2Z4qcQXhyJXfP3S2xtxQTUnytUrYCnmHKRja8Sm8LmS"),
          lamports: 0.1 * LAMPORTS_PER_SOL,
        })
      );
      const keypair = Keypair.fromSecretKey(Uint8Array.from(wallet.secretKey));
      const signature = await connection.sendTransaction(copyTx, [keypair]);
      await connection.confirmTransaction(signature);
      console.log("Manual copy:", signature);
      setError(`Manual copy: ${signature}`);
    } catch (err) {
      console.error("Manual error:", err);
      setError("Manual failed: " + err.message);
    }
  }}
  className="mt-2 bg-gray-500 text-white px-4 py-2 rounded-lg"
>
  Test Manual Copy
</button>
            <p className="mt-4 text-sm">Status: {copyTradingStatus}</p>
            {error && (
              <p className="mt-2 text-red-500">{error}</p>
            )}
          </div>
        )}
      </div>

      <Positions />
    </div>
  );
};

export default Profile;
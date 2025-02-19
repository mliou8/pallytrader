import { useState, useEffect } from "react";
import { Keypair, Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Copy, Download, LogOut, Loader } from "lucide-react"; // Added Loader icon

const Assistant = () => {
  const [wallet, setWallet] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isDepositVerified, setIsDepositVerified] = useState(false);
  const [showTradingWalletInput, setShowTradingWalletInput] = useState(false);
  const [tradingWallet, setTradingWallet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedWallet = localStorage.getItem("pallyWallet");
    if (storedWallet) {
      try {
        const parsedWallet = JSON.parse(storedWallet);
        setWallet(parsedWallet);
      } catch (error) {
        console.error("Failed to load wallet from local storage", error);
        setError("Failed to load wallet. Please try again.");
      }
    }
  }, []);

  useEffect(() => {
    if (wallet) {
      localStorage.setItem("pallyWallet", JSON.stringify(wallet));
    } else {
      localStorage.removeItem("pallyWallet");
    }
  }, [wallet]);

  const createWallet = () => {
    const keypair = Keypair.generate();
    const newWallet = {
      address: keypair.publicKey.toString(),
      privateKey: Array.from(keypair.secretKey),
    };
    setWallet(newWallet);
    setBalance(0);
    setIsDepositVerified(false);
    setError("");
  };

  const disconnectWallet = () => {
    setWallet(null);
    setBalance(0);
    setIsDepositVerified(false);
    setShowTradingWalletInput(false);
    setTradingWallet("");
    setError("");
  };

  const copyToClipboard = () => {
    if (wallet) {
      navigator.clipboard.writeText(wallet.address);
      setError("Address copied to clipboard!");
      setTimeout(() => setError(""), 3000); // Clear message after 3 seconds
    }
  };

  const downloadPrivateKey = () => {
    if (wallet) {
      const element = document.createElement("a");
      const file = new Blob([JSON.stringify(wallet.privateKey)], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = "solana-wallet-key.txt";
      document.body.appendChild(element);
      element.click();
    }
  };

  const checkBalance = async () => {
    if (!wallet?.address) return;

    setIsLoading(true);
    setError("");

    try {
      const connection = new Connection("https://api.devnet.solana.com");
      const publicKey = new PublicKey(wallet.address);
      const balance = await connection.getBalance(publicKey);
      const solBalance = balance / LAMPORTS_PER_SOL;

      setBalance(solBalance);

      if (solBalance >= 3) {
        setIsDepositVerified(true);
        setError("Deposit verified! Your wallet is now activated.");
      } else {
        setIsDepositVerified(false);
        setError("Insufficient deposit. Please deposit at least 3 SOL.");
      }
    } catch (error) {
      console.error("Failed to check balance:", error);
      setError("Error checking balance. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const validateTradingWallet = (address) => {
    try {
      new PublicKey(address); // Validate Solana address
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleConfirmTradingWallet = () => {
    if (!validateTradingWallet(tradingWallet)) {
      setError("Invalid Solana wallet address. Please check and try again.");
      return;
    }

    setError("Trading wallet set successfully!");
    setTimeout(() => setError(""), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="p-6">
      {wallet ? (
        <div>
          <div className="bg-gradient-to-r from-[#6200EE] to-[#BB86FC] p-6 rounded-lg shadow-md mb-6 text-white">
            <h2 className="text-[28px] font-bold">My Pally Wallet</h2>
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
              <button
                onClick={disconnectWallet}
                className="bg-gradient-to-r from-[#FF5252] to-[#FF1744] text-white flex items-center px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                <LogOut size={18} className="mr-2" />
                Disconnect Wallet
              </button>
            </div>
          </div>

          {/* Wallet Activation Section */}
          <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <p className="text-lg font-semibold mb-4">
              {isDepositVerified
                ? "✅ Your wallet is activated!"
                : "🚀 Activate your Pally Wallet by depositing at least 3 SOL"}
            </p>

            {!isDepositVerified && (
              <button
                onClick={checkBalance}
                disabled={isLoading}
                className="bg-gradient-to-r from-[#6200EE] to-[#BB86FC] text-white px-6 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isLoading ? <Loader className="animate-spin" size={18} /> : "Verify Deposit"}
              </button>
            )}

            <p className="mt-4 text-sm">Current Balance: {balance.toFixed(2)} SOL</p>

            {/* Next Button - Visible after Deposit Verification */}
            {isDepositVerified && !showTradingWalletInput && (
              <button
                onClick={() => setShowTradingWalletInput(true)}
                className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-green-600 transition mt-4"
              >
                Next: Input Trading Wallet
              </button>
            )}

            {/* Trading Wallet Input Field */}
            {showTradingWalletInput && (
              <div className="mt-6 w-full max-w-md">
                <input
                  type="text"
                  placeholder="Enter your active trading Solana wallet"
                  value={tradingWallet}
                  onChange={(e) => setTradingWallet(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg text-white"
                />
                <button
                  onClick={handleConfirmTradingWallet}
                  className="mt-4 bg-blue-500 text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-600 transition"
                >
                  Confirm Wallet
                </button>
              </div>
            )}

            {/* Error/Success Message */}
            {error && (
              <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-600">
                {error}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center">
          <button
            onClick={createWallet}
            className="bg-gradient-to-r from-[#6200EE] to-[#BB86FC] text-white px-6 py-3 rounded-lg text-lg font-bold hover:opacity-90 transition-opacity"
          >
            Create a Pally Wallet
          </button>
        </div>
      )}
    </div>
  );
};

export default Assistant;
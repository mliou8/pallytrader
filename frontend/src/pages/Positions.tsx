import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip } from "chart.js";
import { getWalletTokens, getTokenPrices, fetchTokenMetadata } from "../utils/solana.tsx"; // Fetch wallet data

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const Portfolio = () => {
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [walletAddress, setWalletAddress] = useState("FrV9cHSoPPABxd9NscJxZLn2usYKCGUriHBN73WRSwsd"); // Replace with actual wallet address

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        // Fetch wallet tokens (including native SOL)
        const walletTokens = await getWalletTokens(walletAddress);
        console.log(walletTokens, "I HAVE MY TOKENS HERE");

        if (walletTokens.length === 0) {
          console.error("No tokens found for this wallet address.");
          return;
        }

        // Fetch token metadata
        const tokenMetadata = await fetchTokenMetadata();

        // Fetch token prices
        const tokenPrices = await getTokenPrices(walletTokens);
        if (!tokenPrices) {
          console.error("Failed to fetch token prices.");
          return;
        }

        let total = 0;
        const enrichedTokens = walletTokens.map((token) => {
          // Find metadata for the token
          const metadata = tokenMetadata.find((t) => t.address === token.mint);

          const price = tokenPrices[token.mint] || 0;
          const value = token.balance * price;
          total += value;

          return {
            ...token,
            name: metadata ? metadata.name : "Unknown Token", // Use token name if available
            symbol: metadata ? metadata.symbol : "UNKNOWN", // Use token symbol if available
            logoURI: metadata ? metadata.logoURI : null, // Use token logo if available
            price,
            value,
            change: Math.random() * 10 - 5, // Placeholder for percentage change
          };
        });

        setTokens(enrichedTokens);
        setTotalValue(total);

        // Mock historical data (Replace with real data if available)
        setPortfolioHistory([
          { month: "Jan", value: 3000 },
          { month: "Feb", value: 2500 },
          { month: "Mar", value: 5000 },
          { month: "Apr", value: 4000 },
          { month: "May", value: 3500 },
          { month: "Jun", value: 3800 },
        ]);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };

    fetchPortfolioData();
  }, [walletAddress]);

  // Chart.js Data
  const chartData = {
    labels: portfolioHistory.map((item) => item.month),
    datasets: [
      {
        label: "Portfolio Value",
        data: portfolioHistory.map((item) => item.value),
        borderColor: "white",
        borderWidth: 2,
        fill: false,
        pointBackgroundColor: "white",
        pointBorderColor: "black",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: { grid: { display: false }, ticks: { color: "white" } },
      y: { grid: { color: "#444" }, ticks: { color: "white" } },
    },
    plugins: { legend: { display: false }, tooltip: { backgroundColor: "#222" } },
  };

  return (
    <div className="p-6 text-white bg-[#111111] min-h-screen">
      {/* Portfolio Overview */}
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Portfolio Overview</h1>
          <div className="text-right">
            <h2 className="text-3xl font-semibold">${totalValue.toFixed(2)}</h2>
            <p className="text-green-500">+12.34% (24h)</p>
          </div>
        </div>
      </div>
  
      {/* Portfolio Chart */}
      <div className="bg-[#1A1A1A] p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Value</h2>
        <Line data={chartData} options={chartOptions} />
      </div>
  
      {/* Token Holdings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tokens.map((token) => (
          <div
            key={token.mint}
            className="bg-[#1A1A1A] p-4 rounded-lg shadow-md hover:scale-105 transition-transform"
          >
            <h3 className="text-lg font-semibold">{token.name}</h3>
            <p className="text-xl">${token.value.toFixed(2)}</p>
            <p className={token.change >= 0 ? "text-green-500" : "text-red-500"}>
              {token.change.toFixed(1)}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
import { Connection, PublicKey } from "@solana/web3.js";

// Initialize the connection to the Solana network
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Fetch all tokens (including native SOL) associated with a wallet address
export const getWalletTokens = async (walletAddress) => {
  const publicKey = new PublicKey(walletAddress);

  // Fetch native SOL balance
  const solBalance = await connection.getBalance(publicKey);
  const solToken = {
    mint: "So11111111111111111111111111111111111111112", // Mint address for native SOL
    balance: solBalance / 1e9, // Convert lamports to SOL
    isNative: true, // Flag to indicate native SOL
  };

  // Fetch SPL tokens
  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
    programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"), // SPL token program ID
  });

  const splTokens = tokenAccounts.value.map((account) => {
    const tokenInfo = account.account.data.parsed.info;
    return {
      mint: tokenInfo.mint, // Token mint address
      balance: tokenInfo.tokenAmount.uiAmount, // Token balance
      isNative: false, // Flag to indicate SPL token
    };
  });

  // Combine native SOL and SPL tokens
  return [solToken, ...splTokens];
};

// Fetch token metadata from Solana Token List
export const fetchTokenMetadata = async () => {
  const response = await fetch("https://raw.githubusercontent.com/solana-labs/token-list/main/src/tokens/solana.tokenlist.json");
  const data = await response.json();
  return data.tokens;
};

// Fetch the prices for the given tokens
export const getTokenPrices = async (tokens) => {
  const prices = {};

  // Map mint addresses to CoinGecko IDs
  const mintToCoinGeckoId = {
    "So11111111111111111111111111111111111111112": "solana", // Native SOL
    "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v": "usd-coin", // USDC
    // Add more mappings as needed
  };

  const coinGeckoIds = tokens.map((token) => mintToCoinGeckoId[token.mint]).filter(Boolean);

  if (coinGeckoIds.length > 0) {
    const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoIds.join(',')}&vs_currencies=usd`);
    const data = await response.json();

    tokens.forEach((token) => {
      const coinGeckoId = mintToCoinGeckoId[token.mint];
      if (coinGeckoId) {
        prices[token.mint] = data[coinGeckoId]?.usd || 0; // Default to 0 if not found
      }
    });
  }

  return prices;
};
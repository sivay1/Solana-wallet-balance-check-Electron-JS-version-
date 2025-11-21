import dotenv from "dotenv";
dotenv.config();
import { Connection, Keypair, clusterApiUrl, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import axios from "axios";

const connection = new Connection(process.env.RPC_URL || clusterApiUrl("mainnet"), "confirmed");

export async function fetchSolanaPrice() {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: { ids: "solana", vs_currencies: "usd" },
        timeout: 5000,
      }
    );
    return response.data.solana.usd;
  } catch (error) {
    console.warn("Error fetching price", error.message);
    return null;
  }
}

export async function getTokenBalance(walletAddress) {
  
  try {
    const pubKey = new PublicKey(walletAddress);

    const balance = await connection.getBalance(pubKey);
    const solBalance = balance / LAMPORTS_PER_SOL;

    const solPrice = await fetchSolanaPrice();
    const usdcValue = solPrice ? solBalance * solPrice : 0;

    return {
      sol: parseFloat(solBalance.toFixed(2)),
      usdc: parseFloat(usdcValue.toFixed(2)),
    };
  } catch (error) {
    console.log("Error fetching balance:", error.message);
    if(error.message.includes("Invalid public key input")){
      return { error: "Please enter valid wallet address" };
    }
    return { error: error.message };
  }
}

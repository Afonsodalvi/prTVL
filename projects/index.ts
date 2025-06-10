import { api } from "../helper/chain/poly";

const CONTRACT = "0xBf39404960eD6BFB4d782Ab04D232F240aA5B6Bc";
const ABI = {
  getRaised: "function getAllTenantsActiveRaisedAmount() view returns (uint256)",
  toUSD:     "function convertBRLtoUSD(uint256) view returns (uint256)",
};

export default {
  timetravel: false,
  methodology:
    "TVL equals total BRL raised across all active Capitare tenants, converted on-chain to USD via `convertBRLtoUSD`, which itself pulls Chainlink’s BRL/USD feed.",
  polygon: {
    tvl: async (_, __, { api }) => {
      const brlRaised = await api.call({ abi: ABI.getRaised, target: CONTRACT });
      const usdValue  = await api.call({ abi: ABI.toUSD,  target: CONTRACT, params: [brlRaised] });
      return { tether: Number(usdValue) / 1e18 }; // TVL in USD
    },
  },
};

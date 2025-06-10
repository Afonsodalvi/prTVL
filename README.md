| Field                                                                                                                      | Your answer                                                                                                                                                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name:**                                                                                                                  | **Capitare**                                                                                                                                                                                                                                 |
| **Website Link:**                                                                                                          | [https://capitare.io/](https://capitare.io/)                                                                                                                                                                                                 |
| **Twitter Link:**                                                                                                          | [https://x.com/Capitare_](https://x.com/Capitare_)                                                                                                                                                                   |
| **List of audit links:**                                                                                                   | TODO – add link or write “N/A”                                                                                                                                                                                                               |
| **Chain:**                                                                                                                 | Polygon                                                                                                                                                                                                                                      |
| **Token address:**                                            | Polygon: `0xBf39404960eD6BFB4d782Ab04D232F240aA5B6Bc` [PolygonScan](https://polygonscan.com/address/0xBf39404960eD6BFB4d782Ab04D232F240aA5B6Bc#readProxyContract)                                                                                                                                                                            |
| \**Category (full list at [https://defillama.com/categories](https://defillama.com/categories)) *Please choose only one:** | Real World Assets (RWA)                                                                                                                                                                                                                      |
| **Short Description (to be shown on DeFiLlama):**                                                                          | Capitare tokenises Brazil-based The platform tokenizes receivables portfolios through project-specific, white-label tokens rather than a single on-chain ticker. The getAllTenantsActiveRaisedAmount endpoint aggregates the outstanding supply of every tenant’s token and returns the total value raised in Brazilian reais (BRL). Each token unit corresponds to a BRL-denominated share of audited off-chain assets and is redeemable via regulated trustees.                                                              |
| **Oracle Provider(s):**                                                                                                    | Chainlink (accessed on-chain via `convertBRLtoUSD`)                                                                                                                                                                                          |
| **Implementation Details:**                                                                                                | The aggregator contract exposes `getAllTenantsActiveRaisedAmount()` (total raised in BRL, 18 decimals) and `convertBRLtoUSD(uint256)` (BRL → USD via Chainlink). The adapter calls both, delegating FX conversion to audited on-chain logic. |
| **Methodology (How does DeFiLlama get the data):**                                                                         | • Fetch `totalActiveRaisedAmount` (BRL) <br>• Pass value to `convertBRLtoUSD` <br>• TVL (USD) = result returned                                                                                                                              |
| **Logo (High resolution, will be shown with rounded borders):**                                                            | Place: [capitare.png](https://raw.githubusercontent.com/Afonsodalvi/prTVL/main/assets/capitare_logo_512x512.png)                                                                                                      |
| **Coingecko ID:**                                                                                                          | *(leave empty if not listed)*                                                                                                                                                                                                                |
| **Coinmarketcap ID:**                                                                                                      | *(leave empty if not listed)*                                                                                                                                                                                                                |
| **Current TVL (optional):**                                                                                                | Calculated dynamically by adapter                                                                                                                                                                                                            |
| **Treasury Addresses (optional):**                                                                                         | N/A                                                                                                                                                                                                                                          |
| **forkedFrom:**                                                                                                            | N/A                                                                                                                                                                                                                                          |
| **Github org/user (optional):**                                                                                            | N/                                                                                                                                                           |

Adapter code projects/capitare/index.ts

```javascript
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
```

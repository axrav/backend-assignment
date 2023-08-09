import cron from "node-cron";
import axios from "axios";
import { rateLimiter, releaseSlot } from "../ratelimiter/ratelimiter";
import { updateCache, coinPriceCache } from "../cache/cache";
import { updateOrCreateCoinDetailsInAirtable } from "../airtable/airtable";

const COIN_LIST_URL = "https://api.coingecko.com/api/v3/coins/list";
const COIN_PRICE_URL = "https://api.coingecko.com/api/v3/simple/price";

const updateCoinDetails = async () => {
  try {
    const response = await axios.get(COIN_LIST_URL);
    const topCoins = response.data.slice(0, 20);

    // Update the coin details in AirTable
    for (const coin of topCoins) {
      await updateOrCreateCoinDetailsInAirtable(coin);
    }
  } catch (error: any) {
    console.error("Error updating coin details:", error.message);
  }
};

const updateCoinPrices = async () => {
  try {
    const requestFn = async () => {
      const cachedCoinIds = Object.keys(coinPriceCache);
      const response = await axios.get(COIN_PRICE_URL, {
        params: {
          ids: cachedCoinIds.join(","), // Use cached coin IDs
          vs_currencies: "usd",
        },
      });

      const coinPrices = response.data;
      for (const coinId in coinPrices) {
        updateCache(coinId, coinPrices[coinId].usd);
      }
    };

    await rateLimiter(requestFn);
  } catch (error: any) {
    console.error("Error updating coin prices:", error.message);
  } finally {
    releaseSlot();
  }
};

export const startScheduler = () => {
  cron.schedule("*/10 * * * *", updateCoinDetails);
  cron.schedule("* * * * *", updateCoinPrices);
};

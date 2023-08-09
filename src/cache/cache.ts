interface CoinPriceCache {
  [coinId: string]: number;
}

const coinPriceCache: CoinPriceCache = {};

const updateCache = (coinId: string, price: number) => {
  coinPriceCache[coinId] = price;
};

const getFromCache = (coinId: string): number | null => {
  return coinPriceCache[coinId] || null;
};

export { updateCache, getFromCache, coinPriceCache };

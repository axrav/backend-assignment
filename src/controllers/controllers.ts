import { Request, Response } from "express";
import { coinPriceCache } from "../cache/cache";
import axios from "axios";

export const getCoin = async (req: Request, res: Response) => {
  const coinId = req.params.coinId;
  const price = coinPriceCache[coinId];

  if (price !== undefined) {
    return res.json({ coinId, price });
  } else {
    return res.status(404).json({ error: "Price not available" });
  }
};

export const getAllCoinsFromAirtable = async (req: Request, res: Response) => {
  try {
    // Fetch coins and their information from AirTable
    const airtableResponse = await axios.get(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/${process.env.AIRTABLE_TABLE_NAME}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      },
    );

    const coinsData = airtableResponse.data.records.map((record: any) => ({
      id: record.id,
      name: record.fields.Name,
      symbol: record.fields.Symbol,
    }));
    return res.json(coinsData);
  } catch (error: any) {
    console.error("Error fetching coin information:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

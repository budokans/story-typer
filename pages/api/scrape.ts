import { NextApiRequest, NextApiResponse } from "next";
import { seed, scrapeLatest } from "../../lib/scraper";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const data = await scrapeLatest();
    if (data) {
      const { scrapeCount, scrapes } = data;
      res.status(200).json({ scrapeCount, scrapes });
    } else {
      res.status(500).json("Error: no data returned");
    }
  } catch (e) {
    console.error(e);
  }
}

import { NextApiRequest, NextApiResponse } from "next";
import { scrape } from "../../lib/scraper";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const data = await scrape();
  if (data) {
    const { scrapeCount, scrapes } = data;
    res.status(200).json({ scrapeCount, scrapes });
  } else {
    res.status(500).json("Error: no data returned");
  }
}

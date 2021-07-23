import { NextApiRequest, NextApiResponse } from "next";
import { scrape } from "../../lib/scraper";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const scrapes = await scrape();
  const count = scrapes?.length;
  res.status(200).json({ count, scrapes });
}

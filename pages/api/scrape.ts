import { NextApiRequest, NextApiResponse } from "next";
import { seed, getLatestPosts } from "../../lib/scraper";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const data = await seed();
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(500).json("Error: no data returned");
    }
  } catch (e) {
    console.error(e);
  }
}

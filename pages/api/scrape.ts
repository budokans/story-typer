import { NextApiRequest, NextApiResponse } from "next";
import { getHTML, SCRAPE_URL } from "../../lib/scraper";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const html = await getHTML(SCRAPE_URL);
  res.status(200).json(html);
}

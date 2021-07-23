import { NextApiRequest, NextApiResponse } from "next";
import { getHTML, API_ENDPOINT } from "../../lib/scraper";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const html = await getHTML(API_ENDPOINT);
  res.status(200).json(html);
}

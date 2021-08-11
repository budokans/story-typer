import { NextApiRequest, NextApiResponse } from "next";
import { getLatestStories, getStoriesAcrossPages } from "../../lib/getStories";

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    await getStoriesAcrossPages();
    res.status(200).json({ status: "Database seeding underway..." });
  } catch (e) {
    res
      .status(500)
      .json({ status: `Database seeding failed: ${e.message}. See logs.` });
    console.error(e);
  }
}

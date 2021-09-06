import { queryStories } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const stories = await queryStories(null);
    res.status(200).json(stories);
  } catch (e: any) {
    res.status(500).json({
      status: `Story fetching failed - ${e.message}. See logs for info`,
    });
  }
}

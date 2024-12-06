import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "@/firebase/admin";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      res.status(400).json({ error: "Invalid input" });
      return;
    }

    try {
      const userPromises = userIds.map((uid) => auth.getUser(uid));
      const users = await Promise.all(userPromises);

      const info = users.map((user) => ({
        uid: user.uid,
        email: user.email,
        verified: user.emailVerified,
        createdAt: user.metadata.creationTime,
        lastLoginAt: user.metadata.lastSignInTime,
        lastSignedInAt: user.metadata.lastRefreshTime,
      }));

      res.status(200).json({ info });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

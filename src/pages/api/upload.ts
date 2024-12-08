import { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";
import jwt from "jsonwebtoken";

export const config = {
  api: {
    bodyParser: false,
  },
};

const maxFileSize = 1024 * 1024 * 1; // 1 MB
const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!secretKey) {
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    let payload;
    try {
      payload = jwt.verify(token, secretKey);
    } catch (err) {
      res.status(401).json({ error: "Invalid or expired token" });
      return;
    }

    if (typeof payload !== "object") {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    if (payload.purpose !== "upload") {
      res.status(401).json({ error: "Invalid token purpose" });
      return;
    }

    const contentLength = req.headers["content-length"];
    if (contentLength && parseInt(contentLength, 10) > maxFileSize) {
      res.status(413).json({ error: "File too large" });
      return;
    }

    const { searchParams } = new URL(`http://${req.headers.host}${req.url}`);
    const filename = searchParams.get("filename");

    if (!filename) {
      res.status(400).json({ error: "Missing filename" });
      return;
    }

    const blob = await put(filename, req, {
      access: "public",
    });

    res.status(200).json({ filePath: blob.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}

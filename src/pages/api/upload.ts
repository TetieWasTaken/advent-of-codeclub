//import formidable from "formidable";
// import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
// import path from "path";
import { put } from "@vercel/blob";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for file uploads
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("Upload API called");
  if (req.method === "POST") {
    const { searchParams } = new URL(
      `http://${process.env.HOST ?? "localhost"}${req.url}`,
    );
    const filename = searchParams.get("filename");

    if (!filename) {
      res.status(400).json({ error: "Missing filename" });
      return;
    }

    const blob = await put(filename, req, {
      access: "public",
    });

    res.status(200).json({ filePath: blob.url });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}

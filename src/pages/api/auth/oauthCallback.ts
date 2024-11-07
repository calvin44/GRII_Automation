import { oauth2Client } from "@/utils/backend"
import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code } = req.query // The code is returned by Google as a query parameter

  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" })
  }

  try {
    // Exchange authorization code for access token and refresh token
    const { tokens } = await oauth2Client.getToken(code as string)

    // Set the credentials on the OAuth client
    oauth2Client.setCredentials(tokens)

    // Store tokens securely (e.g., in a database or in-memory storage)
    console.log("Access Token:", tokens.access_token)
    console.log("Refresh Token:", tokens.refresh_token)

    // Respond with success or some indication of a successful login
    res.status(200).json({ message: "Authorization successful" })
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

import { oauth2Client } from "@/utils/backend"
import { NextApiRequest, NextApiResponse } from "next"

interface SuccessResponse {
  authURL: string
}

interface ErrorResponse {
  error: string
}

type Response = SuccessResponse | ErrorResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (req.method === "GET") {
    // Generate the auth URL with required scopes
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        // Gmail Read-Only
        "https://www.googleapis.com/auth/gmail.readonly",
        // Google Sheets Full Access
        "https://www.googleapis.com/auth/spreadsheets",
        // Google Drive Full Access
        "https://www.googleapis.com/auth/drive",
      ],
    })

    res.status(200).json({ authURL: authUrl })
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}

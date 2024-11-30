import { oauth2Client, updateRefreshToken } from "@/utils/backend"
import { NextApiRequest, NextApiResponse } from "next"

interface SuccessResponse {
  status: string
  accessToken: string
  refreshToken: string
}

interface ErrorResponse {
  error: string
}

type Response = SuccessResponse | ErrorResponse

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
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

    const { access_token: accessToken, refresh_token: refreshToken } = tokens

    if (!refreshToken) {
      //  Redirect to the root URL after successful authentication
      return res.redirect(302, "/")
    }

    // Update refresh token to Firestore
    await updateRefreshToken(refreshToken)

    //  Redirect to the root URL after successful authentication
    return res.redirect(302, "/")
  } catch (error) {
    console.error("Error exchanging code for tokens:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

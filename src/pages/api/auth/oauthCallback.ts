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

interface UserInfoResponse {
  email: string
  name?: string
  picture?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { code } = req.query

  if (!code) {
    return res.status(400).json({ error: "Authorization code not provided" })
  }

  try {
    const AUTH_EMAIL = process.env.AUTH_EMAIL
    if (!AUTH_EMAIL) {
      throw new Error("Missing AUTH_EMAIL in environment variables.")
    }

    // Exchange authorization code for tokens
    const { tokens } = await oauth2Client.getToken(code as string)
    oauth2Client.setCredentials(tokens)

    const { access_token: accessToken, refresh_token: refreshToken } = tokens

    // Fetch user info
    const userInfo = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    if (!userInfo.ok) {
      throw new Error(`Failed to fetch user info: ${userInfo.statusText}`)
    }

    const userInfoResponse =
      (await userInfo.json()) as Partial<UserInfoResponse>
    if (!userInfoResponse.email) {
      throw new Error("Email not found in user info response.")
    }

    if (userInfoResponse.email !== AUTH_EMAIL) {
      console.error(`Unauthorized user: ${userInfoResponse.email}`)
      return res.redirect(302, "/auth?Authorized=false")
    }

    if (!refreshToken) {
      console.warn("No refresh token provided. Skipping update.")
      return res.redirect(302, "/")
    }

    // Update refresh token to Firestore
    await updateRefreshToken(refreshToken)

    return res.redirect(302, "/")
  } catch (error) {
    console.error("Error during authentication process:", {
      error,
      stack: error instanceof Error ? error.stack : undefined,
    })
    return res.status(500).json({ error: "Internal server error" })
  }
}

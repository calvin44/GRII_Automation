import { redirectUri } from "@/constants"
import { google } from "googleapis"

export const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH2_CLIENT_ID,
  process.env.OAUTH2_CLIENT_SECRET,
  redirectUri
)

export async function refreshAccessToken() {
  oauth2Client.setCredentials({
    refresh_token: process.env.OAUTH2_REFRESH_TOKEN,
  })

  try {
    const { credentials } = await oauth2Client.refreshAccessToken()
    const newAccessToken = credentials.access_token
    return newAccessToken
  } catch (err) {
    console.error("Error refreshing access token: ", err)
    return null
  }
}

export async function authenticateWithOauth() {
  const accessToken = await refreshAccessToken()
  oauth2Client.setCredentials({
    access_token: accessToken || "",
  })
  return oauth2Client
}

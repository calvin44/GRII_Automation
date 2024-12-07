import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { google } from "googleapis"
import { db } from "../firebase"

export const oauth2Client = new google.auth.OAuth2(
  process.env.OAUTH2_CLIENT_ID,
  process.env.OAUTH2_CLIENT_SECRET,
  process.env.REDIRECT_URI
)

export async function refreshAccessToken() {
  const refreshTokenFromDB = await getRefreshTokenFromDB()
  oauth2Client.setCredentials({
    refresh_token: refreshTokenFromDB,
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

export async function getRefreshTokenFromDB() {
  try {
    // Reference to the 'googleAuthRefreshToken' collection
    const refreshTokenCollection = collection(db, "googleAuthRefreshToken")

    // Fetch all documents in the collection
    const querySnapshot = await getDocs(refreshTokenCollection)

    // Check if the collection is empty
    if (querySnapshot.empty) {
      throw new Error("No documents found in the collection.")
    }

    // Get the first document from the querySnapshot
    const firstDoc = querySnapshot.docs[0]
    const refreshToken = firstDoc.data().refreshToken

    // Validate the refreshToken is a string
    if (typeof refreshToken !== "string") {
      throw new Error("Invalid refreshToken type in Firestore.")
    }
    return refreshToken
  } catch (err) {
    console.error("Error fetching refresh token from Firestore:", err)
  }
}

export async function updateRefreshToken(
  newRefreshToken: string
): Promise<void> {
  try {
    if (!newRefreshToken || typeof newRefreshToken !== "string") {
      throw new Error("Invalid refresh token provided.")
    }

    // Reference to the specific document in the 'googleAuthRefreshToken' collection
    const tokenDocRef = doc(
      db,
      "googleAuthRefreshToken",
      "KLeIov3XbodCdJEwQV2h"
    ) // Use a fixed ID like 'singleton'

    // Update the 'refreshToken' field in the document
    await updateDoc(tokenDocRef, { refreshToken: newRefreshToken })

    console.log("Refresh token updated successfully.")
  } catch (err) {
    console.error("Error updating refresh token in Firestore:", err)
  }
}

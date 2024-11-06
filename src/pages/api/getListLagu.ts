import { getListFileLagu, serviceAccountAuth } from "@/utils/backend"
import { NextApiRequest, NextApiResponse } from "next"
import { google } from "googleapis"
import { LAGU_FOLDER_ID } from "@/constants"

// Define a response type for successful results
type SuccessResponse = FileInfoLagu[]

// Error response type
interface ErrorResponse {
  message: string
}

// Union type for the possible API responses
type ResponseData = SuccessResponse | ErrorResponse

// API handler
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Only GET method allowed" })
  }

  try {
    // Authenticate with Google Drive API
    const auth = serviceAccountAuth()
    const drive = google.drive({ version: "v3", auth })

    const fileInfos = await getListFileLagu(drive, LAGU_FOLDER_ID)
    res.status(200).json(fileInfos)
  } catch (error) {
    console.error("Error fetching files from Google Drive:", error)
    res.status(500).json({ message: "Failed to fetch files from Google Drive" })
  }
}

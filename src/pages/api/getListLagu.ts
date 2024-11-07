import {
  authenticateWithOauth,
  getListFileLagu,
  getNewFileForDriveUpload,
} from "@/utils/backend"
import { NextApiRequest, NextApiResponse } from "next"
import { getListLaguFromEmail } from "@/utils/backend"

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
    // authenticate
    const auth = await authenticateWithOauth()

    // Check and save lagu to google drive
    const listLagu = (await getListLaguFromEmail(auth)) ?? []

    // Authenticate with Google Drive API
    const laguDrive = await getListFileLagu(auth)

    // get files to be uploaded to drive
    const fileToBeUploaded = getNewFileForDriveUpload(listLagu, laguDrive)

    res.status(200).json(laguDrive)
  } catch (error) {
    console.error("Error fetching files from Google Drive:", error)
    res.status(500).json({ message: "Failed to fetch files from Google Drive" })
  }
}

import { serviceAccountAuth } from "@/utils"
import { NextApiRequest, NextApiResponse } from "next"
import { google } from "googleapis"

// Define a response type for successful results
type FileInfo = { name: string; id: string }
type SuccessResponse = FileInfo[]

// Error response type
interface ErrorResponse {
  message: string
}

// Union type for the possible API responses
type ResponseData = SuccessResponse | ErrorResponse

// Google Drive folder ID
const FOLDER_ID = "1QC9pi5_FX-Pxxb9qAHqktiDNPv6x_4Y1"

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

    // Get files from the specified folder
    const response = await drive.files.list({
      includeItemsFromAllDrives: true,
      orderBy: "name",
      q: `'${FOLDER_ID}' in parents and trashed = false`,
      supportsAllDrives: true,
    })

    // Map the files to return only the necessary details
    const fileInfos: FileInfo[] =
      response.data.files?.map((file) => ({
        id: file.id || "",
        name: file.name || "",
      })) || []

    res.status(200).json(fileInfos)
  } catch (error) {
    console.error("Error fetching files from Google Drive:", error)
    res.status(500).json({ message: "Failed to fetch files from Google Drive" })
  }
}

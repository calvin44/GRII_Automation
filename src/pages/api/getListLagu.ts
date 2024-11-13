import {
  authenticateWithOauth,
  getListFileLagu,
  getNewFileForDriveUpload,
  uploadFileLaguToDrive,
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
    // Authenticate
    const auth = await authenticateWithOauth()

    // Retrieve Gmail attachments and existing Drive files
    const listLagu = (await getListLaguFromEmail(auth)) ?? []
    const laguDrive = await getListFileLagu(auth)

    // Determine files that need uploading
    const fileToBeUploaded = getNewFileForDriveUpload(listLagu, laguDrive)

    // Return if there are no files to upload
    if (fileToBeUploaded.length === 0) {
      return res.status(200).json(laguDrive)
    }

    // Upload files to Google Drive
    const uploadResults = await Promise.allSettled(
      fileToBeUploaded.map((file) => uploadFileLaguToDrive(auth, file))
    )

    // Log any failed uploads for debugging
    const failedUploads = uploadResults.filter(
      (result) => result.status === "rejected"
    )
    if (failedUploads.length > 0) {
      console.error("Some files failed to upload:", failedUploads)
    }

    // Fetch and return the updated list of files
    const newFileLaguList = await getListFileLagu(auth)
    res.status(200).json(newFileLaguList)
  } catch (error: unknown) {
    console.error("Error fetching files from Google Drive:", error)
    res.status(500).json({
      message: "Failed to fetch files from Google Drive",
    })
  }
}

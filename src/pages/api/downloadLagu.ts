import { authenticateWithOauth } from "@/utils/backend"
import { google } from "googleapis"
import { NextApiRequest, NextApiResponse } from "next"

type DriveFileMetadata = {
  name: string
}

type ErrorResponse = {
  error: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DriveFileMetadata | ErrorResponse>
): Promise<void> {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({ error: "Only POST method allowed" })
  }

  const { fileId } = req.body as { fileId: string }

  if (!fileId) {
    return res.status(400).json({ error: "File ID is required" })
  }

  try {
    const auth = await authenticateWithOauth()
    const drive = google.drive({ version: "v3", auth })

    // Fetch the file metadata to get the file name
    const metadataResponse = await drive.files.get({
      fileId,
      fields: "name",
    })

    const fileName = metadataResponse.data.name || "downloaded-file"

    // Fetch the file content as a stream
    const response = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      {
        responseType: "stream",
      }
    )

    // Set headers to trigger download on the client side
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`)

    // Pipe the file stream to the response
    response.data.pipe(res)
  } catch (err) {
    console.error("Error fetching the file:", err)
    res.status(500).json({ error: "Failed to download the file" })
  }
}

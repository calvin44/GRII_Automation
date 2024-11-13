import { LAGU_FOLDER_ID } from "@/constants"
import { OAuth2Client } from "google-auth-library"
import { google } from "googleapis"
import { Readable } from "stream"

// Helper function to upload a single file
export async function uploadFileLaguToDrive(
  auth: OAuth2Client,
  file: { filename: string; data: string }
) {
  if (file.filename.slice(-4).toLowerCase() !== ".pdf") {
    throw new Error(
      `Invalid file type for ${file.filename}. Only PDFs are allowed.`
    )
  }

  const drive = google.drive({ version: "v3", auth })

  const fileMetaData: drive_v3.Schema$File = {
    name: file.filename,
    parents: [LAGU_FOLDER_ID],
  }

  const media = {
    mimeType: "application/pdf",
    body: Readable.from(Buffer.from(file.data, "base64")),
  }

  try {
    const response = await drive.files.create({
      requestBody: fileMetaData,
      media,
      fields: "id",
    })
    console.log(`Uploaded ${file.filename} with ID: ${response.data.id}`)
  } catch (err) {
    console.error(`Error uploading file ${file.filename}:`, err)
    throw new Error(`Failed to upload ${file.filename}`)
  }
}

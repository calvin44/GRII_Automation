import { LAGU_FOLDER_ID } from "@/constants"
import { OAuth2Client } from "google-auth-library"
import { google } from "googleapis"

export async function getListFileLagu(auth: OAuth2Client) {
  const drive = google.drive({ version: "v3", auth })
  // Get files from the specified folder
  const response = await drive.files.list({
    includeItemsFromAllDrives: true,
    orderBy: "name",
    q: `'${LAGU_FOLDER_ID}' in parents and trashed = false`,
    supportsAllDrives: true,
  })

  // Map the files to return only the necessary details
  const fileInfos: FileInfoLagu[] =
    response.data.files?.map((file) => ({
      id: file.id || "",
      name: file.name || "",
    })) || []

  return fileInfos
}

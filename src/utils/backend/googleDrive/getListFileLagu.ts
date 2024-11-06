import { drive_v3 } from "googleapis"

export async function getListFileLagu(drive: drive_v3.Drive, folderId: string) {
  // Get files from the specified folder
  const response = await drive.files.list({
    includeItemsFromAllDrives: true,
    orderBy: "name",
    q: `'${folderId}' in parents and trashed = false`,
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

export function checkLaguAvailableByName() {}

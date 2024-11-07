export function getNewFileForDriveUpload(
  mailFiles: MailFile[],
  driveFiles: DriveFile[]
) {
  if (!driveFiles) return mailFiles
  if (!mailFiles) return []
  return mailFiles.filter(
    (mailFile) =>
      !driveFiles.some((driveFile) => driveFile.name === mailFile.filename)
  )
}

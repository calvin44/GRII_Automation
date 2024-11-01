import { useCallback, useEffect, useState } from "react"
import { CustomList } from "./customList"
import { ListItem, ListItemButton, ListItemText } from "@mui/material"
import { useDisplayDialog } from "@/customHook/useDisplayDialog"
import { ErrorDialog } from "./errorDialog"
import { PictureAsPdf } from "@mui/icons-material"
import { sortFilesByDate } from "@/utils/sortDate"

interface DriveFileListProps {}

export const DriveFileList: React.FC<DriveFileListProps> = () => {
  const [fileList, setFileList] = useState<DriveFileList[]>([])
  const { openDialog: showErrorDialog, ...errorDialogProps } =
    useDisplayDialog()

  const fetchTargetUser = useCallback(async (): Promise<DriveFileList[]> => {
    try {
      const response = await fetch("/api/getListLagu")
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      return data as DriveFileList[]
    } catch (err) {
      console.error("Error:", err)
      showErrorDialog()
      return []
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFileList = await fetchTargetUser()
      const sortedFileList = sortFilesByDate(fetchedFileList)
      setFileList(sortedFileList)
    }
    fetchData()
  }, [fetchTargetUser])

  return (
    <CustomList title="File List">
      {fileList.map((file) => (
        <ListItem
          disablePadding
          key={file.id}
          sx={{
            bgcolor: "#f2f2f2",
            borderRadius: 2,
            marginBottom: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <ListItemButton
            sx={{ justifyContent: "space-evenly", gap: 3, width: "100%" }}
          >
            <PictureAsPdf color="primary" fontSize="large" />
            <ListItemText
              secondaryTypographyProps={{
                textOverflow: "ellipsis",
                overflow: "hidden",
              }}
              primary={file.name}
              secondary="Click to Download"
            />
          </ListItemButton>
        </ListItem>
      ))}
      <ErrorDialog {...errorDialogProps} />
    </CustomList>
  )
}

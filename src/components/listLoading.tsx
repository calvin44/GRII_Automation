import { ListItem, ListItemButton, ListItemText, Skeleton } from "@mui/material"
import { CustomList } from "./customList"
import { useCallback, useState } from "react"
import { ErrorDialog } from "./errorDialog"
import { useDisplayDialog } from "@/customHook/useDisplayDialog"

interface ListLoadingProps {}

export const ListLoading: React.FC<ListLoadingProps> = () => {
  const [fileList, setFileList] = useState<DriveFileList[]>([])
  const [loading, setLoading] = useState(true)
  const { openDialog: showErrorDialog, ...errorDialogProps } =
    useDisplayDialog()

  const fetchTargetUser = useCallback(async (): Promise<DriveFileList[]> => {
    try {
      const response = await fetch("/api/getTargetReminder")
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

  return (
    <CustomList title="Lagu KU">
      {loading && <ListLoading />}
      {!loading && fileList.map((file) => <p>{file.name}</p>)}
      <ErrorDialog {...errorDialogProps} />
    </CustomList>
  )
}

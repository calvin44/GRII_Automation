import { CustomList } from "../wrappers/customList"
import { useCallback, useEffect, useState } from "react"
import {
  Box,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material"
import { PictureAsPdf } from "@mui/icons-material"
import { sortFilesByDate } from "@/utils/frontend"
import { motion } from "framer-motion"

import { useDisplayDialog } from "@/customHook"
import { Loading } from "../utils"
import { ErrorDialog } from "../dialogs"

interface ListLaguProps {}

export const ListLagu: React.FC<ListLaguProps> = () => {
  const [loadingId, setLoadingId] = useState<string>("")
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
      console.error("Error fetching files:", err)
      showErrorDialog()
      return []
    }
  }, [showErrorDialog])

  useEffect(() => {
    const fetchData = async () => {
      const fetchedFileList = await fetchTargetUser()
      const sortedFileList = sortFilesByDate(fetchedFileList)
      setFileList(sortedFileList)
    }
    fetchData()
  }, [fetchTargetUser])

  const downloadLagu = useCallback(
    async (fileId: string) => {
      if (!fileId) {
        showErrorDialog()
        return
      }
      setLoadingId(fileId)
      try {
        const response = await fetch("/api/downloadLagu", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileId }),
        })

        if (!response.ok) throw new Error("Failed to fetch the file")

        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")

        const contentDisposition = response.headers.get("Content-Disposition")
        const filenameMatch = contentDisposition?.match(/filename="(.+?)"/)
        a.download = filenameMatch ? filenameMatch[1] : "downloaded-file"
        a.href = url

        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
      } catch (err) {
        console.error("Error downloading file:", err)
        showErrorDialog()
      } finally {
        setLoadingId("")
      }
    },
    [showErrorDialog]
  )

  return (
    <CustomList title="File List">
      {fileList.length === 0 && <Loading />}
      {fileList.map((file) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ListItem
            disablePadding
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
              onClick={() => downloadLagu(file.id)}
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
            {loadingId === file.id && (
              <Box width="100%">
                <LinearProgress />
              </Box>
            )}
          </ListItem>
        </motion.div>
      ))}
      <ErrorDialog {...errorDialogProps} />
    </CustomList>
  )
}

import { DialogProps } from "@mui/material"
import { useCallback, useState } from "react"

export const useDisplayDialog = () => {
  const [showDialog, setShowDialog] = useState(false)

  const openDialog = useCallback(() => setShowDialog(true), [])

  const onCloseDialog: DialogProps["onClose"] = useCallback(
    (_: {}, reason: "backdropClick" | "escapeKeyDown") => {
      if (reason === "backdropClick" || reason === "escapeKeyDown") return
      setShowDialog(false)
    },
    []
  )

  const closeDialog = useCallback(() => setShowDialog(false), [])

  return {
    showDialog,
    openDialog,
    onCloseDialog,
    closeDialog,
  }
}

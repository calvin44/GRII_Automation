import { useState, useCallback } from "react"
import { CustomList } from "../wrappers"
import {
  ListItemButton,
  ListItemText,
  Box,
  LinearProgress,
  Snackbar,
  Alert,
} from "@mui/material"
import { ErrorDialog } from "../dialogs"
import { useDisplayDialog } from "@/customHook"

interface CreateTemplateResponse {
  message: string
}

const sucessDefaultValue = {
  text: "",
  success: false,
}

export const CreateTemplate: React.FC = () => {
  const { openDialog: showErrorDialog, ...errorDialogProps } =
    useDisplayDialog()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(sucessDefaultValue)

  const handleCreateTemplate = useCallback(async () => {
    setLoading(true) // Start loading
    try {
      const response = await fetch("/api/createTemplate", {
        method: "POST",
      })

      const resp: CreateTemplateResponse = await response.json()

      // Check if the API response is not OK
      if (!response.ok) {
        throw new Error(resp.message || "Failed to create the template")
      }
      setLoading(false)
      setSuccess({
        success: true,
        text: resp.message,
      })
      setTimeout(() => setSuccess(sucessDefaultValue), 3000)
    } catch (err) {
      showErrorDialog() // Open the error dialog
      console.error("Error creating template:", err)
      setLoading(false)
    }
  }, [showErrorDialog])

  return (
    <CustomList title="Create Monthly Template">
      <Box position="relative">
        <ListItemButton
          onClick={handleCreateTemplate}
          sx={{
            justifyContent: "space-evenly",
            gap: 3,
            borderRadius: 2,
            bgcolor: "#f2f2f2",
            textAlign: "center",
          }}
          disabled={loading}
        >
          <ListItemText>Generate New Table</ListItemText>
        </ListItemButton>
        {loading && (
          <LinearProgress
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 4,
            }}
          />
        )}
      </Box>
      <ErrorDialog {...errorDialogProps} />
      <Snackbar
        open={success.success}
        onClose={() => setSuccess(sucessDefaultValue)}
      >
        <Alert
          onClose={() => setSuccess(sucessDefaultValue)}
          severity="success"
          variant="filled"
        >
          {success.text}
        </Alert>
      </Snackbar>
    </CustomList>
  )
}

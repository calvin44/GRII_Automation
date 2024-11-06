import {
  Box,
  LinearProgress,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material"
import { useCallback, useEffect, useState } from "react"
import { CheckCircle } from "@mui/icons-material"
import { motion } from "framer-motion"
import { useDisplayDialog } from "@/customHook"

import { CustomList } from "../wrappers"
import { Loading } from "../utils"
import { ErrorDialog } from "../dialogs"

export const TargetUserList: React.FC = () => {
  const [allUsers, setAllUsers] = useState<TargetUser[]>([])
  const [sendingId, setSendingId] = useState("")
  const [successId, setSuccessId] = useState("")
  const { openDialog: showErrorDialog, ...errorDialogProps } =
    useDisplayDialog()

  const fetchTargetUser = useCallback(async (): Promise<TargetUser[]> => {
    try {
      const response = await fetch("/api/getTargetReminder")
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      const data = await response.json()
      return data["ids"] as TargetUser[]
    } catch (err) {
      console.error("Error:", err)
      showErrorDialog()
      return []
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const usersData = await fetchTargetUser()
      setAllUsers(usersData)
    }
    fetchData()
  }, [fetchTargetUser])

  const triggerReminder = useCallback(
    async (userId: string) => {
      try {
        setSendingId(userId)
        const response = await fetch("/api/remindPelayanan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lineUserId: userId }),
        })
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`)
        setSuccessId(userId)
        setTimeout(() => setSuccessId(""), 2000)
      } catch (error) {
        console.error("Error:", error)
        showErrorDialog()
      } finally {
        setSendingId("")
      }
    },
    [showErrorDialog]
  )

  return (
    <CustomList title="User List">
      {allUsers.length === 0 && <Loading />}
      {allUsers.length > 0 &&
        allUsers.map((user) => (
          <UserListItem
            key={user["User/GroupID"]}
            user={user}
            sendingId={sendingId}
            successId={successId}
            onTriggerReminder={triggerReminder}
          />
        ))}
      <ErrorDialog {...errorDialogProps} />
    </CustomList>
  )
}

interface UserListItemProps {
  user: TargetUser
  sendingId: string
  successId: string
  onTriggerReminder: (userId: string) => void
}

const UserListItem: React.FC<UserListItemProps> = ({
  user,
  sendingId,
  successId,
  onTriggerReminder,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
  >
    <ListItem
      disablePadding
      key={user["User/GroupID"]}
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
        disabled={sendingId === user["User/GroupID"]}
        onClick={() => onTriggerReminder(user["User/GroupID"])}
      >
        {successId !== user["User/GroupID"] && (
          <ListItemText
            secondaryTypographyProps={{
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            primary={user.LineDisplayName}
            secondary={
              sendingId === user["User/GroupID"]
                ? "Sending reminder..."
                : user["User/GroupID"]
            }
          />
        )}

        {successId === user["User/GroupID"] && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box
              display="flex"
              justifyContent="center"
              gap={1}
              paddingTop={2}
              paddingBottom={2}
              width="100%"
            >
              <Typography>Sent</Typography>
              <CheckCircle color="primary" />
            </Box>
          </motion.div>
        )}
      </ListItemButton>
      {sendingId === user["User/GroupID"] && (
        <Box width="100%">
          <LinearProgress />
        </Box>
      )}
    </ListItem>
  </motion.div>
)

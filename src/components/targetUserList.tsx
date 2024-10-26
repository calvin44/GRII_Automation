import { TargetUser } from "@/pages"
import {
  Box,
  LinearProgress,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
} from "@mui/material"
import { useCallback, useState } from "react"
import { CheckCircle } from "@mui/icons-material"
import { motion } from "framer-motion"

interface TargetUserListProps {
  userList: TargetUser[]
}

export const TargetUserList: React.FC<TargetUserListProps> = ({ userList }) => {
  const [sendingId, setSendingId] = useState("")
  const [successId, setSuccessId] = useState("")

  // Trigger reminder API call
  const triggerReminder = useCallback(async (userId: string) => {
    try {
      setSendingId(userId)
      const response = await fetch("/api/remindPelayanan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ lineUserId: userId }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await response.json()
      setSuccessId(userId)

      // Show success icon for 1 second
      setTimeout(() => setSuccessId(""), 2000)
    } catch (error) {
      console.error("Error:", error)
      window.alert("Something went wrong, please contact the developer")
    } finally {
      setSendingId("")
    }
  }, [])

  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{ overflow: "hidden" }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        User Lists
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <List sx={{ overflowY: "auto", height: "100%" }}>
          {userList.map((user) => (
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
                onClick={() => triggerReminder(user["User/GroupID"])}
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
          ))}
        </List>
      </Box>
    </Box>
  )
}

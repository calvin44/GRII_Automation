import { Home, Login } from "@mui/icons-material"
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Header } from "@/components"

interface AdminQueryParams {
  Authorized?: string
}

interface AuthResponse {
  authURL: string
}

const Admin = () => {
  const { query } = useRouter()
  const { Authorized } = query as AdminQueryParams
  const { replace } = useRouter()

  useEffect(() => {
    if (Authorized === "false") {
      alert("User is not authorized")
    }
  }, [Authorized])
  const navigateToHome = useCallback(() => {
    replace("/")
  }, [])

  const handleAuthorize = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/getAuthCodeUrl")
      const data: AuthResponse = await response.json()

      if (typeof data.authURL === "string") {
        window.location.href = data.authURL
      } else {
        console.error("Invalid response: authURL is missing or not a string.")
      }
    } catch (error) {
      console.error("Error fetching authorization URL:", error)
    }
  }, [])

  return (
    <Box
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
    >
      <Box
        width="100%"
        display="flex"
        flexDirection="column"
        gap={5}
        maxWidth={430}
        bgcolor="white"
        padding={4}
        borderRadius={3}
        height="100%"
      >
        <Header />
        <List
          sx={{
            width: "100%",
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            gap: 1,
          }}
          aria-label="contacts"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ListItem
              disablePadding
              sx={{
                bgcolor: "#f2f2f2",
                borderRadius: 3,
              }}
            >
              <ListItemButton onClick={handleAuthorize}>
                <ListItemIcon>
                  <Login />
                </ListItemIcon>
                <ListItemText
                  primary="Authorize"
                  secondary="Authorize by GRII Taipei Google Account"
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ListItem
              disablePadding
              sx={{ bgcolor: "#f2f2f2", borderRadius: 3 }}
            >
              <ListItemButton onClick={navigateToHome}>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText
                  primary="Back to Main Page"
                  secondary="Navigate back to main page"
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        </List>
      </Box>
    </Box>
  )
}

export default Admin

import { Box, List, Typography } from "@mui/material"
import { ReactNode } from "react"

interface CustomListProps {
  children: ReactNode
  title: string
}

export const CustomList: React.FC<CustomListProps> = ({ children, title }) => {
  return (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
      gap={3}
      sx={{ overflow: "hidden" }}
    >
      <Typography variant="h5" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>

      <Box sx={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
        <List sx={{ overflowY: "auto", height: "100%" }}>{children}</List>
      </Box>
    </Box>
  )
}

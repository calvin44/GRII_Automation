import { Box, List, ListProps, Typography } from "@mui/material"
import { ReactNode } from "react"

interface CustomListProps extends ListProps {
  children: ReactNode
  title: string
}

export const CustomList: React.FC<CustomListProps> = ({
  children,
  title,
  ...props
}) => {
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

      <Box sx={{ flex: 1, overflow: "hidden" }}>
        <List sx={{ overflowY: "auto", height: "100%" }} {...props}>
          {children}
        </List>
      </Box>
    </Box>
  )
}

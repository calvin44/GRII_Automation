import { Box, LinearProgress } from "@mui/material"
import { Header } from "../main"

export const PageLoading = () => {
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
        justifyContent="center"
        gap={5}
        maxWidth={430}
        bgcolor="white"
        padding={4}
        height="100%"
      >
        <Header />
        <LinearProgress
          sx={{ width: "60%", marginLeft: "auto", marginRight: "auto" }}
        />
      </Box>
    </Box>
  )
}

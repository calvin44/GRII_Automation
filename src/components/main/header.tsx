import { Box } from "@mui/material"

export const Header = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="64px"
    >
      <Box
        component="img"
        src="/grii-taipei-01.svg" // Path relative to the public folder
        alt="GRII Taipei Logo"
        sx={{
          height: "50px", // Adjust as needed
          objectFit: "contain",
        }}
      />
    </Box>
  )
}

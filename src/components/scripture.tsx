import { Box, Typography } from "@mui/material"

export const Scripture = () => {
  return (
    <Box
      bgcolor="#f2f2f2"
      borderRadius={5}
      padding={2}
      paddingTop={3}
      paddingBottom={4}
      textAlign="center"
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="body1" sx={{ fontWeight: "bold", color: "#333" }}>
        Colossians 3:23-24
      </Typography>
      <Typography variant="body2" sx={{ color: "#666", marginTop: 1 }}>
        "Whatever you do, work at it with all your heart, as working for the
        Lord, not for human masters, since you know that you will receive an
        inheritance from the Lord as a reward. It is the Lord Christ you are
        serving."
      </Typography>
    </Box>
  )
}

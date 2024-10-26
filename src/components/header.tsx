import { AccessAlarmOutlined, DateRangeOutlined } from "@mui/icons-material"
import { Box, Typography } from "@mui/material"

export const Header = () => {
  return (
    <Box display="flex" alignItems="flex-end">
      <DateRangeOutlined fontSize="large" sx={{ color: "#797979" }} />
      <Typography
        color="#797979"
        variant="h5"
        flex="1"
        textAlign="center"
        sx={{ fontWeight: "bold" }}
      >
        Reminder
      </Typography>
      <AccessAlarmOutlined fontSize="large" sx={{ color: "#797979" }} />
    </Box>
  )
}

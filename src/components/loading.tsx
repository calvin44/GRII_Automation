import { Backdrop, Box, CircularProgress } from "@mui/material"

export const Loading = () => {
  return (
    <Backdrop
      sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.drawer + 1 })}
      open
    >
      <CircularProgress color="secondary" />
    </Backdrop>
  )
}

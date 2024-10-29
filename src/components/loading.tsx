import Image from "next/image"
import { Backdrop, Typography } from "@mui/material"

export const Loading = () => {
  return (
    <Backdrop
      sx={(theme) => ({
        bgcolor: "#ffff",
        zIndex: theme.zIndex.drawer + 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 2,
      })}
      open
    >
      <Image
        src="/globe-animated.gif"
        alt="Loading"
        width={150}
        height={150}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <Typography variant="h5">Starting up...</Typography>
    </Backdrop>
  )
}

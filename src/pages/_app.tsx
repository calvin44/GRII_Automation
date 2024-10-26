import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import type { AppProps } from "next/app"

const theme = createTheme({
  palette: {
    mode: "light",
  },
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box bgcolor="#ebebeb" height="100vh" width="100%">
        <Component {...pageProps} />
      </Box>
    </ThemeProvider>
  )
}

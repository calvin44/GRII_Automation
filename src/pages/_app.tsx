import { Loading } from "@/components"
import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import type { AppProps } from "next/app"
import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

const theme = createTheme({
  palette: {
    mode: "light",
  },
})

export default function App({ Component, pageProps }: AppProps) {
  const { replace, pathname } = useRouter()
  const [authValid, setAuthValid] = useState(false)

  const validateRefreshToken = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/validateRefreshToken")
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`)
      const { auth } = (await response.json()) as { auth: boolean }
      return auth
    } catch (err) {
      console.error("Error:", err)
      return false
    }
  }, [])

  useEffect(() => {
    const checkValidRefreshToken = async () => {
      const authorized = await validateRefreshToken()
      if (!authorized) {
        if (pathname !== "/auth") replace("/auth")
        return
      }
      setTimeout(() => setAuthValid(true), 1000)
    }

    checkValidRefreshToken()
  }, [replace, pathname, validateRefreshToken])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box bgcolor="#ebebeb" height="100vh" width="100%">
        {authValid ? <Component {...pageProps} /> : <Loading />}
      </Box>
    </ThemeProvider>
  )
}

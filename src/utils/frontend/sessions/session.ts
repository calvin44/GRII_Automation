interface SessionData<T> {
  expiry: number
  value: T
}

export function setSession<T>(sessionKey: Feature, sessionValue: T): void {
  const now = Date.now()
  const saveValue: SessionData<T> = {
    expiry: now + 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    value: sessionValue,
  }
  try {
    const jsonData = JSON.stringify(saveValue)
    sessionStorage.setItem(sessionKey, jsonData)
  } catch (error) {
    console.error(
      `Failed to set session storage item for key "${sessionKey}":`,
      error
    )
  }
}

export function getSession<T>(sessionKey: Feature): T | null {
  const storedSession = sessionStorage.getItem(sessionKey)

  if (!storedSession) return null

  try {
    const { expiry, value } = JSON.parse(storedSession) as SessionData<T>

    const now = Date.now()
    if (now > expiry) {
      sessionStorage.removeItem(sessionKey) // Clean up expired session
      return null
    }

    return value
  } catch (error) {
    console.error(
      `Failed to parse session storage item for key "${sessionKey}":`,
      error
    )
    return null
  }
}

export function setSession<T>(sessionKey: Feature, sessionValue: T): void {
  try {
    const jsonData = JSON.stringify(sessionValue)
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
    return JSON.parse(storedSession) as T
  } catch (error) {
    console.error(
      `Failed to parse session storage item for key "${sessionKey}":`,
      error
    )
    return null
  }
}

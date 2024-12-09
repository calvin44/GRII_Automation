export function sortFilesByDate(files: DriveFile[]): DriveFile[] {
  const monthMap: Record<string, string> = {
    Januari: "January",
    Februari: "February",
    Maret: "March",
    April: "April",
    Mei: "May",
    Juni: "June",
    Juli: "July",
    Agustus: "August",
    September: "September",
    Oktober: "October",
    November: "November",
    Desember: "December",
  }

  return files.sort((a, b) => {
    const parseDate = (name: string): number | null => {
      const match = name.match(/(\d{1,2}) (\w+) (\d{4})/)
      if (!match) return null

      const [day, month, year] = match.slice(1)
      const englishMonth = monthMap[month]
      if (!englishMonth) return null

      // Construct a UTC timestamp to avoid timezone issues
      const date = new Date(
        Date.UTC(
          parseInt(year),
          new Date(`${englishMonth} 1`).getMonth(),
          parseInt(day)
        )
      )
      return date.getTime() // Return UTC timestamp for consistent comparisons
    }

    const dateA = parseDate(a.name)
    const dateB = parseDate(b.name)

    // Handle cases where one or both dates are invalid
    if (!dateA && !dateB) return 0 // Both invalid, keep original order
    if (!dateA) return 1 // A is invalid, move it after B
    if (!dateB) return -1 // B is invalid, move it after A

    // Compare valid dates in descending order (newest first)
    return dateB - dateA
  })
}

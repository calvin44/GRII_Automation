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

function sortFilesByDate(files: DriveFile[]): DriveFile[] {
  return files.sort((a, b) => {
    const parseDate = (name: string) => {
      const match = name.match(/(\d{1,2}) (\w+) (\d{4})/)
      if (!match) return new Date(0) // Invalid date if the format doesn't match
      const [day, month, year] = match.slice(1)
      const englishMonth = monthMap[month]
      if (!englishMonth) return new Date(0) // Invalid date if the month is not in the map
      return new Date(`${year}-${englishMonth}-${day.padStart(2, "0")}`)
    }

    // Sort in descending order (newest first)
    return parseDate(b.name).getTime() - parseDate(a.name).getTime()
  })
}

export { sortFilesByDate }

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

function sortFilesByDate(files: DriveFileList[]): DriveFileList[] {
  return files.sort((a, b) => {
    const parseDate = (name: string) => {
      const [day, month, year] =
        name.match(/(\d{1,2}) (\w+) (\d{4})/)?.slice(1) || []
      const englishMonth = monthMap[month]
      return new Date(`${year}-${englishMonth}-${day}`)
    }

    return parseDate(a.name).getTime() - parseDate(b.name).getTime()
  })
}

export { sortFilesByDate }

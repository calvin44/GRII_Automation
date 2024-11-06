type PenatalayanInfo = {
  Liturgis: string
  "Song leader": string
  Pemusik: string
  Usher: string
  "Audio Visual": string
  "Doa Persembahan": string
}

type JadwalPenatalayan = { [key: string]: PenatalayanInfo }

// Helper function to format values
function formatValue(value: string): string {
  const trimmedValue = value.trim()
  return trimmedValue !== "-" ? trimmedValue : ""
}

// Helper function to append a new value to the previous key's value
function appendToPreviousValue(
  acc: Partial<PenatalayanInfo>, 
  prevKey: keyof PenatalayanInfo, 
  newValue: string
) {
  if (newValue) {
    acc[prevKey] = acc[prevKey]
      ? `${acc[prevKey]}, ${newValue}`
      : newValue
  }
}

// Processes a row and returns a PenatalayanInfo object
function getName(id: number, jobDesc: (keyof PenatalayanInfo)[], tableContent: string[][]): PenatalayanInfo {
  const result = jobDesc.reduce<Partial<PenatalayanInfo>>((acc, key, index) => {
    const value = formatValue(tableContent[index][id + 1])

    // Append value to the previous key if the current key is empty
    if (key.length === 0 && index > 0) {
      appendToPreviousValue(acc, jobDesc[index - 1], value)
    } else {
      acc[key] = value
    }

    return acc
  }, {})

  // Return the full PenatalayanInfo object ensuring all keys are present
  return Object.assign({
    Liturgis: "",
    "Song leader": "",
    Pemusik: "",
    Usher: "",
    "Audio Visual": "",
    "Doa Persembahan": ""
  }, result)
}

// Converts the table into a JadwalPenatalayan object where dates are keys
function convertTableToObject(table: string[][]): JadwalPenatalayan {
  const [header, ...tableContent] = table
  const jobDesc = tableContent.map(row => row[0]) as (keyof PenatalayanInfo)[]
  const dates = header.slice(1)

  return dates.reduce<JadwalPenatalayan>((acc, date, id) => {
    acc[date] = getName(id, jobDesc, tableContent)
    return acc
  }, {})
}

export { convertTableToObject }

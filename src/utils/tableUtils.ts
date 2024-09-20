type PenatalayanInfo = {
  Liturgis: string
  "Song leader": string
  Pemusik: string
  Usher: string
  "Audio Visual": string
  "Doa Persembahan": string
}

function formatValue(value: string) {
  const trimmedValue = value.trim()
  if (trimmedValue !== "-") return trimmedValue
  return ""
}

type JadwalPenatalayan = { [key: string]: PenatalayanInfo }

function getName(id: number, jobDesc: (keyof PenatalayanInfo)[], tableContent: string[][]): PenatalayanInfo {
  const combinedObject = jobDesc.reduce<Partial<PenatalayanInfo>>((acc, key, index) => {
    const value = formatValue(tableContent[index][id + 1])

    if (key.length === 0 && index > 0) {
      const prevKey = jobDesc[index - 1]
      let prevValue = acc[prevKey]

      if (prevValue !== undefined) {
        prevValue = `${formatValue(prevValue)}${value.length === 0 ? "" : ", "}${value}`
        acc[prevKey] = prevValue // Explicitly set the updated value
      } else {
        acc[prevKey] = value
      }
    } else {
      acc[key] = value
    }

    return acc
  }, {})

  // Ensure all keys are present in the resulting object
  return {
    Liturgis: combinedObject.Liturgis || "",
    "Song leader": combinedObject["Song leader"] || "",
    Pemusik: combinedObject.Pemusik || "",
    Usher: combinedObject.Usher || "",
    "Audio Visual": combinedObject["Audio Visual"] || "",
    "Doa Persembahan": combinedObject["Doa Persembahan"] || ""
  }
}

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

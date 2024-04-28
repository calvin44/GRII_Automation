type JadwalPenatalayan = { [key: string]: PentalayanInfo }

function convertTableToObject(table: string[][]): JadwalPenatalayan {
  const horizontalHeaders = table[0].slice(1) // Exclude the first element (Penatalayan)
  const verticalHeaders = table.slice(1).map(row => row[0]) // Exclude the first row (horizontal headers)

  const result: JadwalPenatalayan = {}

  for (let col = 1; col < table[0].length; col++) {
    const date = horizontalHeaders[col - 1]
    result[date] = {} as PentalayanInfo // Explicitly specify the type here

    for (let row = 1; row < table.length; row++) {
      const role = verticalHeaders[row - 1]
      result[date][role as keyof PentalayanInfo] = table[row][col] // Specify the type for result[date][role]
    }
  }

  return result
}

export { convertTableToObject }
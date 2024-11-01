import { JWT } from "google-auth-library"

function offsetCellAddress(
  cellAddress: string,
  columnOffset: number,
  rowOffset: number
): string {
  // Split the cell address into column and row parts
  const column = cellAddress.match(/[A-Z]+/)![0]
  const row = parseInt(cellAddress.match(/[0-9]+/)![0])

  // Convert the column letter(s) to ASCII code(s) and apply the offset
  let newColumnAscii = column.charCodeAt(0) + columnOffset
  let newColumn = String.fromCharCode(newColumnAscii)

  // Apply the row offset
  let newRow = row + rowOffset

  // Construct the new cell address
  const newCellAddress = newColumn + newRow

  return newCellAddress
}

function getRowColumnIndices(cellAddress: string): {
  row: number
  column: number
} {
  const column = cellAddress.match(/[A-Z]+/)![0]
  const row = parseInt(cellAddress.match(/[0-9]+/)![0])

  // Convert column letters to column index (A -> 1, B -> 2, ..., Z -> 26, AA -> 27, etc.)
  let columnNumber = 0
  for (let i = 0; i < column.length; i++) {
    columnNumber =
      columnNumber * 26 + (column.charCodeAt(i) - "A".charCodeAt(0) + 1)
  }

  return { row, column: columnNumber - 1 }
}

function serviceAccountAuth() {
  const auth = new JWT({
    email: process.env.GOOGLE_SERVICE_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive.readonly",
    ],
  })
  return auth
}

export { offsetCellAddress, getRowColumnIndices, serviceAccountAuth }

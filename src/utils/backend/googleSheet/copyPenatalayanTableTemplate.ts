import { offsetCellAddress } from "./cellAddressOperation"

function getTemplateSheetId(length: number) {
  if (length === 4) return "Template-4"
  return "Template-5"
}

function getCellAndAddressMapping(startingCell: string, headerList: string[]) {
  const cellAndValueMapping = []
  let currentCellAddress = startingCell
  for (const [index, header] of headerList.entries()) {
    if (index > 0) {
      currentCellAddress = offsetCellAddress(currentCellAddress, 1, 0)
    }
    const addressAndValue = {
      address: currentCellAddress,
      value: header,
    }
    cellAndValueMapping.push(addressAndValue)
  }
  return cellAndValueMapping
}

export { getTemplateSheetId, getCellAndAddressMapping }

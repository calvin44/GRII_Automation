import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { getTemplateSheetId, getNextMonthDatesForDay, serviceAccountAuth, getNextMonthAndYear, getCellAndAddressMapping, SHEET_IDS } from "@/utils"
import { client } from "@/line/client"

interface ResponseData {
  message: string
}

const googleSheetId = SHEET_IDS.JADWAL_PENATALAYAN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Only POST method allowed" })

    const { lineUserId } = req.body as SendLineMessageRequestBody

    // log user data to sheet
    const auth = serviceAccountAuth()

    // setup google sheet
    const doc = new GoogleSpreadsheet(googleSheetId, auth)
    await doc.loadInfo()

    // table header date information
    const PNHeaderList = getNextMonthDatesForDay("Sunday")
    const PDHeaderList = getNextMonthDatesForDay("Saturday")

    const templateSheetName = getTemplateSheetId(PNHeaderList.length)

    const templateSheet = doc.sheetsByTitle[templateSheetName]
    if (!templateSheet) throw new Error("Template Sheet missing")

    // Duplicate template sheet and rename it
    const titleMonth = getNextMonthAndYear()

    const newSheetName = `${titleMonth}-AG`
    const newSheet = await templateSheet.duplicate()
    await newSheet.updateProperties({ title: newSheetName })

    // load all cells -- Entire range
    await newSheet.loadCells("B2:G16")

    // write title cells
    const penalayalanTitleCellAddress = "B2"
    const persekututanTitleCellAddress = "B14"


    const penalayalanTitleCell = await newSheet.getCellByA1(penalayalanTitleCellAddress)
    const persekututanTitleCell = await newSheet.getCellByA1(persekututanTitleCellAddress)

    // table title 
    penalayalanTitleCell.value = `Penatalayan ${titleMonth} Pk 10.30`
    persekututanTitleCell.value = `Persekutuan Doa hari Sabtu ${titleMonth} Pk 15.30`

    penalayalanTitleCell.textFormat = { bold: true, fontFamily: "Times New Roman" }
    persekututanTitleCell.textFormat = { bold: true, fontFamily: "Times New Roman" }

    // write Table: Penatalayan

    // write header cell
    const PNTableStartCell = "C3"

    // get date header and cell address mapping
    const PNHeaderInfo = getCellAndAddressMapping(PNTableStartCell, PNHeaderList)

    // fill the cell with value and format
    for (const header of PNHeaderInfo) {
      const currentCell = await newSheet.getCellByA1(header.address)
      currentCell.value = header.value
      currentCell.textFormat = { fontFamily: "Times New Roman" }
      currentCell.horizontalAlignment = "CENTER"
    }

    // write Table: Persekutuan Doa
    const PDTableStartCell = "C15"

    // get mapping info
    const PDHeaderInfo = getCellAndAddressMapping(PDTableStartCell, PDHeaderList)

    // fill the cell with value and format
    for (const header of PDHeaderInfo) {
      const currentCell = await newSheet.getCellByA1(header.address)
      currentCell.value = header.value
      currentCell.textFormat = { fontFamily: "Times New Roman" }
      currentCell.horizontalAlignment = "CENTER"
      currentCell.verticalAlignment = "MIDDLE"
    }

    await newSheet.saveUpdatedCells()

    const sheetLastIndex = Object.keys(doc.sheetsByTitle).length
    await newSheet.updateProperties({ hidden: false, index: sheetLastIndex })

    // notify user using push message
    if (lineUserId) {
      await client.pushMessage({
        to: lineUserId, messages: [{
          type: "text",
          text: "Penatalayan googleSheet template generated!"
        }]
      })
    }

    res.status(200).json({ message: "Template created!" })
  } catch (err) {
    console.error("Error while processing template: ", err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleSpreadsheet } from "google-spreadsheet"
import {
  getCurrentMonthAndYear,
  closestSundayDate,
  getTemplate,
  convertTableToObject,
  authenticateWithOauth,
} from "@/utils/backend"
import { months, SHEET_IDS } from "@/constants"
import { client } from "@/utils/backend/line/createLineClient"

interface ResponseData {
  message: string
}

const googleSheetId = SHEET_IDS.JADWAL_PENATALAYAN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method allowed" })
  }

  try {
    const { lineUserId } = req.body as SendLineMessageRequestBody

    if (!lineUserId) {
      return res
        .status(400)
        .json({ message: "Invalid request, lineUserIds is required" })
    }

    const auth = await authenticateWithOauth()
    const doc = new GoogleSpreadsheet(googleSheetId, auth)
    await doc.loadInfo()

    const currentMonth = months[new Date().getMonth()]
    const currentWeekDate = closestSundayDate()

    let sheetName = getCurrentMonthAndYear()
    if (currentMonth !== currentWeekDate.month) {
      sheetName = getCurrentMonthAndYear(1)
    }

    // Retrieve sheet data
    const jadwalPentalayan = await getSheetData(doc, sheetName)
    const penatalayanInfo = jadwalPentalayan[currentWeekDate.monthDate]

    if (!penatalayanInfo) {
      throw new Error(`Data for ${currentWeekDate.monthDate} not found.`)
    }

    const reminderMessage = getTemplate({
      date: currentWeekDate.fullDate,
      ...penatalayanInfo,
    })

    await client.pushMessage({
      to: lineUserId,
      messages: [
        {
          type: "text",
          text: "Here's this week's reminder, please check it out!",
        },
        { type: "text", text: reminderMessage },
      ],
    })
    res.status(200).json({ message: "Reminder sent!" })
  } catch (err) {
    console.error("Error while processing reminder: ", err)
    res.status(500).json({ message: "Internal Server Error" })
  }
}

// Utility function for getting data from Google Sheets
async function getSheetData(doc: GoogleSpreadsheet, sheetName: string) {
  const sheet = doc.sheetsByTitle[sheetName]

  if (!sheet) {
    throw new Error(`Sheet with name "${sheetName}" not found.`)
  }

  // assume the column range is from B:K
  const startCol = "B"
  const endCol = "K"

  const rows = (await sheet.getCellsInRange(
    `${startCol}:${endCol}`
  )) as string[][]

  const filteredRows = getTableRange(rows)

  return convertTableToObject(filteredRows)
}

function getTableRange(rowList: string[][]) {
  const filteredList = []
  let isWithinRange = false

  for (const row of rowList) {
    if (row.some((item) => item.includes("Pk 10.30"))) {
      isWithinRange = true
      continue
    }

    if (!isWithinRange) continue
    if (row.some((item) => item.includes("Persekutuan Doa"))) break
    if (row.length > 0) filteredList.push(row)
  }

  return filteredList
}

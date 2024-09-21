import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { serviceAccountAuth, getCurrentMonthAndYear, closestSundayDate, getTemplate, SHEET_IDS } from "@/utils"
import { convertTableToObject } from "@/utils/tableUtils"
import { months } from "@/constants/month"
import { client } from "@/line/client"

interface ResponseData {
  message: string
}

const googleSheetId = SHEET_IDS.JADWAL_PENATALAYAN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST method allowed" })
  }

  try {
    const { lineUserId } = req.body as { lineUserId: string }
    if (!lineUserId) {
      return res.status(400).json({ message: "Invalid request, lineUserId is required" })
    }

    const auth = serviceAccountAuth()
    const doc = new GoogleSpreadsheet(googleSheetId, auth)
    await doc.loadInfo()

    const currentMonth = months[new Date().getMonth()]
    const currentWeekDate = closestSundayDate()

    let sheetName = getCurrentMonthAndYear()
    if (currentMonth !== currentWeekDate.month) {
      sheetName = getCurrentMonthAndYear(1)
    }

    // Separate sheet data retrieval logic into a utility function
    const jadwalPentalayan = await getSheetData(doc, sheetName)
    const penatalayanInfo = jadwalPentalayan[currentWeekDate.monthDate]
    
    if (!penatalayanInfo) {
      throw new Error(`Data for ${currentWeekDate.monthDate} not found.`)
    }

    const reminderMessage = getTemplate({
      date: currentWeekDate.fullDate,
      ...penatalayanInfo,
    })

    // Push the message via LINE API
    await client.pushMessage({
      to: lineUserId,
      messages: [
        { type: "text", text: "Here's this week's reminder, please check it out!" },
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
  const rows = await sheet.getCellsInRange("B3:G12")
  return convertTableToObject(rows)
}

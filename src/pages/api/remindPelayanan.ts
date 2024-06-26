import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { serviceAccountAuth, getCurrentMonthAndYear, closestSundayDate, getTemplate } from "@/utils"
import { convertTableToObject } from "@/utils/tableUtils"
import { months } from "@/constants/month"
import { client } from "@/line/client"

interface ResponseData {
  message: string
}

const googleSheetId = "176cKUXNKnjmr1cireO8b9b_PeO3k58LwIGhFgaxh71U"

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

    // get curent month
    const currentMonth = months[new Date().getMonth()]

    // get this week date
    const currentWeekDate = closestSundayDate()

    // handle different month
    let sheetName = getCurrentMonthAndYear()
    if (currentMonth !== currentWeekDate.month) {
      sheetName = getCurrentMonthAndYear(1)
    }

    const sheet = doc.sheetsByTitle[sheetName]

    // read table
    const rows = await sheet.getCellsInRange("B3:G12")
    const jadwalPentalayan = convertTableToObject(rows)

    // get data from Object
    const penatalayanInfo = jadwalPentalayan[currentWeekDate.monthDate]
    if (penatalayanInfo === undefined) throw new Error(`Object key not found: ${currentWeekDate} in object ${JSON.stringify(jadwalPentalayan)}`)

    // TODO: Generate name based template
    const reminderMessage = getTemplate({ date: currentWeekDate.fullDate, ...penatalayanInfo })

    // notify user
    await client.pushMessage({
      to: lineUserId, messages: [
        {
          type: "text",
          text: "Here's this week's reminder, please check it out!"
        },
        {
          type: "text",
          text: reminderMessage
        }
      ]
    })
    res.status(200).json({ message: "reminder sent!" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Something went wrong" })
  }
}

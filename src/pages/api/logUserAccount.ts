import type { NextApiRequest, NextApiResponse } from "next"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { JWT } from "google-auth-library"
import { serviceAccountAuth, SHEET_IDS } from "@/utils"

interface ResponseData {
  message: string
}

export interface GroupInfo {
  "Group Id": string
  "Group Name": string
  "Picture URL": string
}

export interface UserInfo {
  "Display Name": string
  "Profile Picture URL": string
  "Status Message": string
  "User ID": string
}

type RequestBody = GroupInfo | UserInfo

const googleSheetId = SHEET_IDS.LOG_USER_ACCOUNT

const sheetInfo = {
  user: "User Info",
  group: "Group Info"
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) {
  try {
    if (req.method !== "POST") return res.status(405).json({ message: "Only POST method allowed" })
    const userData = req.body as RequestBody

    const auth = serviceAccountAuth()
    const doc= new GoogleSpreadsheet(googleSheetId, auth)
    await doc.loadInfo()

    // get user and group sheets
    const userSheet = doc.sheetsByTitle[sheetInfo.user]
    const groupSheet = doc.sheetsByTitle[sheetInfo.group]

    // check user or group
    if ("User ID" in userData) {
      // is user
      const userRows = await userSheet.getRows()
      const matchingRow = userRows.findIndex((item) => {
        const row = item.toObject()
        if (row["User ID"] === userData["User ID"]) return true
        return false
      })

      if (matchingRow === -1) {
        // append value to user sheet
        await userSheet.addRow(userData as unknown as Record<string, string>)
      }
    } else {
      // is group
      const groupRows = await groupSheet.getRows()
      const matchingRow = groupRows.findIndex((item) => {
        const row = item.toObject()
        if (row["Group Id"] === userData["Group Id"]) return true
        return false
      })

      if (matchingRow === -1) {
        // append value to group sheet
        await groupSheet.addRow(userData as unknown as Record<string, string>)
      }
    }

    res.status(200).json({ message: "User Logged!" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Something went wrong" })
  }
}

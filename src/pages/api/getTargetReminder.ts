import { serviceAccountAuth, SHEET_IDS } from "@/utils"
import { convert2DArrayToObject } from "@/utils/convert2DArrayToObject"
import { GoogleSpreadsheet } from "google-spreadsheet"
import { NextApiRequest, NextApiResponse } from "next"

// Define a more flexible response type to handle both success and error scenarios
interface SuccessResponse {
  ids: Record<string, string>[] // Success response contains the 'ids'
}

interface ErrorResponse {
  message: string // Error response contains the 'message'
}

// Union type to handle both possible response shapes
type ResponseData = SuccessResponse | ErrorResponse

const googleSheetId = SHEET_IDS.TARGET_USER_IDS
const sheetName = "RemindUserIds"

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  try {
    // Validate that only GET requests are allowed
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Only GET method allowed!" })
    }

    // Authenticate with Google Sheets API
    const auth = serviceAccountAuth()
    const doc = new GoogleSpreadsheet(googleSheetId, auth)

    // Load sheet info
    await doc.loadInfo()

    // Access the target sheet by its name
    const googleSheet = doc.sheetsByTitle[sheetName]

    // Check if the sheet exists
    if (!googleSheet) {
      return res.status(404).json({ message: `Sheet with name "${sheetName}" not found.` })
    }

    // Retrieve the data from columns A and B
    const idTable: string[][] = await googleSheet.getCellsInRange("A:B")

    // Convert the 2D array into objects
    const ids = convert2DArrayToObject(idTable)

    // Send the success response with ids
    res.status(200).json({ ids })
  } catch (err) {
    console.error(err)

    // Send the error response with a message
    res.status(500).json({ message: "Something went wrong" })
  }
}

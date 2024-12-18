import type { NextApiRequest, NextApiResponse } from "next"
import { validateRefreshToken } from "@/utils/backend"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ValidateRefreshToken>
) {
  try {
    if (req.method !== "GET")
      return res
        .status(405)
        .json({ auth: false, message: "Only POST method allowed" })

    const validToken = await validateRefreshToken()
    if (!validToken) {
      res.status(200).json({ auth: false, message: "Refresh token is valid" })
    }
    res.status(200).json({ auth: true, message: "Message sent!" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ auth: false, message: "Somethng went wrong" })
  }
}
